const { response } = require('express');
const { prisma } = require('../database');
const bcryptjs = require('bcryptjs')
const multer = require('multer')
const jwt = require('jsonwebtoken');


/**
 * @method POST
 * @name createUser
 * @description este es el metodo empleado para crear un nuevo usuario en la plataforma
 * @params data: { username,password,email,categories }
 * @returns Usuario creado en la base de datos
 */

const createUser = async (req, res = response) => {
  const data = JSON.parse(JSON.stringify(req.body)); // Obtener datos del cuerpo de la solicitud
  try {
    const findUser = await prisma.user.findFirst({ // Buscar si ya existe un usuario con el mismo correo o nombre de usuario
      where: {
        OR: [
          {
            email: data.email,
          },
          {
            username: data.username,
          },
        ],
      }
    });
    if (findUser) { // Si se encuentra un usuario, devolver un error 400 indicando que el usuario ya existe
      res.status(400).json({
        status: 400,
        message: 'el usuario ya existe',
      });
      return;
    }

    if (!data.categories || data.categories.length === 0) { // Verificar si el arreglo de categorías seleccionadas está vacío
      // Si está vacío, devolver un error 400 indicando que el arreglo está vacío
      res.status(400).json({
        status: 400,
        message: 'El arreglo de categorías seleccionadas está vacío',
      });
      return;
    }

    const hashedPassword = await bcryptjs.hash(data.password, 10);

    const createdUser = await prisma.user.create({ // Crear un nuevo usuario en la base de datos utilizando los datos proporcionados
      data: {
        username: data.username,
        password: hashedPassword,
        email: data.email,
        categories: {
          connect: data.categories.map(id => ({ id }))  // Conectar la categoría seleccionada por el usuario
        },
        profilePhoto: "defaultp.png",
        banner: "defaultb.jpg"
      },
    });

    res.status(201).json({  // Devolver una respuesta con estado 201 indicando que el usuario se creó exitosamente
      status: 201,
      message: 'usuario creado con exito',
      data: createdUser,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      message: 'internal server error',
    });
  }
};

/**
 * @method GET
 * @name getAllUsers
 * @description obtiene todos los usuarios registrados en la Base de Datos
*/
const getAllUsers = async (req, res = response) => {
  try {
    //con el metodo findmany traemos a los usuarios y los asignamos a data.
    //y prisma genera el query para la consulta
    const users = await prisma.user.findMany();
    res.status(200).json({
      status: 200,
      data: { users },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      message: 'internal server error',
    });
  }
};

/**
 * @name getUserById
 * @description retorna un usuario segun su id en la bdd; en caso de no existir el resultado es null
 * @params id: int
 * @returns {}Usuario || null
 */
const getUserById = async (req, res = response) => {
  //con findunique buscamos un elemento dada una condicion, en este caso el id de usuario
  let { id } = req.params;
  id = parseInt(id);
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      res.status(404).json({
        status: 404,
        message: 'usuario no encontrado',
      });
      return;
    }
    //devuelve los datos del usuario en formato json.
    res.status(200).json({
      status: 200,
      data: { user },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      message: 'internal server error',
    });
  }
};

/**
 * @name getUserByUsername
 * @description retorna un usuario segun su id en la bdd; en caso de no existir el resultado es null
 * @params id: int
 * @returns {}Usuario || null
 */
const getUserByUsername = async (req, res = response) => {
  let { username } = req.params;
  try {
    const users = await prisma.user.findMany({
      where: {
        username: {
          contains: username,
        },
      },
    });
    res.status(200).json({
      status: 200,
      data: { users },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      message: 'Error interno del servidor',
    });
  }
};

  
  
/**
 * @method DELETE
 * @description elimina un usuario identificandolo por su id en la base de datos
 * @name deleteUser
 * @params { id: int }
 */
const deleteUser = async (req, res = response) => {
  let { id } = req.params;
  id = parseInt(id);
  try {
    //llamamos a la funcion para obtener el usuario que buscamos
    const user = await prisma.user.findUnique({ where: { id } });
    //si no existe en la base de datos nos devuelve usuario no encontrado
    if (!user) {
      res.status(404).json({
        status: 404,
        message: 'usuario no existente',
      });
      return;
    }
    //si el usuario esta registrado, se eliminan sus datos y relaciones en la base de datos
    await prisma.user.delete({ where: { id: id } });
    res.status(200).json({
      status: 200,
      message: 'usuario eliminado con exito',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      message: 'internal server error',
    });
  }
};

/**
 * @method PUT
 * @name modifyUser
 * @description edita un usuario identificandolo por su id en la base de datos
 * @body { 
  username, email, password, categories}
 * @params { id: int }
 */
const modifyUser = async (req, res = response) => {
  let { id } = req.params;
  id = parseInt(id);
  const { ...data } = req.body;
  try {
    // Eliminar datos de la tabla _categorytouser relacionados con el ID del usuario
    await prisma.$executeRaw`
      DELETE FROM _categorytouser
      WHERE B = ${id}`;

    // Actualizar usuario en la tabla user
    await prisma.user.update({
      where: { id },
      data: {
        username: data.username,
        email: data.email,
        categories: {
          connect: data.categories.map(id => ({ id }))  // Conectar la categoría seleccionada por el usuario
        },
        description: data.description,
        profilePhoto: data.profilePhoto,
        banner: data.banner
      },
    });

    res.status(200).json({
      status: 200,
      message: 'usuario modificado con éxito',
      data
    });
  } catch (error) {
    console.log(error);
    //Con esta condición controlamos que no pueda editar sus datos de modo que se carguen dos usuarios
    //con estas mismas credenciales.
    const findUser = await prisma.user.findFirst({
      where: {
        OR: [
          {
            email: data.email,
          },
          {
            username: data.username,
          },
        ],
      },
    });

    if (findUser && findUser.id !== id) {
      res.status(400).json({
        status: 400,
        message: 'un usuario con esas credenciales ya existe',
      });
      return;
    }
    res.status(500).json({
      status: 500,
      message: 'internal server error',
    });
  }
};

/**
 * @method PUT
 * @name modifyPassword
 * @description edita un usuario identificandolo por su id en la base de datos
 * @body { 
  username, email, password, categories}
 * @params { id: int }
 */
const modifyPassword = async (req, res = response) => {
  let { id } = req.params;
  id = parseInt(id);
  const { ...data } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    const passwordMatch = await bcryptjs.compare(data.actualPassword, user.password);
    if (passwordMatch) {
      const hashedPassword = await bcryptjs.hash(data.newPassword, 10);
      // Actualizar usuario en la tabla user
      await prisma.user.update({
        where: { id },
        data: {
          password: hashedPassword,
        },
      });

      res.status(200).json({
        status: 200,
        message: 'contraseña modificada con éxito',
        data
      });
    }
    else {
      res.send("La contraseña ingresada no coincide con la actual")
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      message: 'internal server error',
    });
  }
};

/**
 * @method GET
 * @name getUserCategories
 * @description obtiene todos los usuarios registrados en la Base de Datos
*/
const getUserCategories = async (req, res = response) => {
  let { id } = req.params;
  id = parseInt(id);
  try {
    //con el metodo findmany traemos a los usuarios y los asignamos a data.
    //y prisma genera el query para la consulta
    const categories = await prisma.$queryRaw`
    SELECT A FROM _categorytouser
    WHERE B = ${id}`;
    res.status(200).json({
      status: 200,
      data: { categories }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      message: 'internal server error',
    });
  }
};

/**
 * @method POST
 * @name userLogin
 * @description Realiza el inicio de sesión de un usuario.
 * @body { 
 *   email: string, 
 *   password: string 
 * }
 * @params { 
 *   id: int 
 * }
 */

const userLogin = async (req, res) => {
  // Obtener datos del cuerpo de la solicitud
  const { email, password } = req.body;

  try {
    // Buscar un usuario único en la base de datos que coincida con el email proporcionado
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Si no se encuentra un usuario, devolver una respuesta de error
      res.status(200).json({
        status: 0,
        msg: "usuario no existente"
      });
      return;
    }
    // Comparar la contraseña proporcionada con la contraseña almacenada en la base de datos utilizando bcrypt
    const passwordMatch = await bcryptjs.compare(password, user.password);

    if (!passwordMatch) {
      console.log(password, user.password)
      // Si la contraseña no coincide, devolver una respuesta de error
      res.status(200).json({
        status: 0,
        msg: "contraseña incorrecta"
      });
      return;
    }
    // Si se encuentra un usuario y la contraseña coincide, generar un token JWT y devolverlo en la respuesta
    const token = jwt.sign({ usuario: user }, process.env.JWT);
    res.json({
      status: 1,
      msg: "Usuario encontrado",
      user,
      token
    });
  } catch (error) {
    // Si ocurre un error durante el proceso, devolver una respuesta de error con un mensaje descriptivo
    res.status(400).json({
      status: 0,
      msg: "error loggeando usuario"
    });
  }
};

// verificacion del tokenn 
verifyToken = async (req, res, next) => {
  // Obtener el token del encabezado de autorización
  const authHeader = req.headers.authorization;
  const token = authHeader;
  if (!token) {
    // Si no hay token, devolver un error de autenticación
    return res.status(401).json({
      "msg": 'error de autenticacion'
    });;
  }

  try {
    // Verificar y decodificar el token
    const decoded = jwt.verify(token, process.env.JWT);
    // Agregar la información del usuario al objeto de solicitud para su posterior uso
    req.user = decoded;

    // Continuar con la ejecución de la ruta
    next();
  } catch (err) {
    // Si el token no es válido, devolver un error de autenticación
    return res.status(401).json({
      "msg": 'debe registrarse para realizar esta operacion'
    });
  }
}

const updateProfilePhoto = async (req, res) => {
  let { id } = req.params;
  id = parseInt(id);

  const file = req.file;
  console.log(file.filename);

  await prisma.user.update({
    where: { id },
    data: {
      profilePhoto: file.filename,
    },
  });
  res.send(file);

}

const updateBanner = async (req, res) => {
  let { id } = req.params;
  id = parseInt(id);

  const file = req.file;
  console.log(file.filename);

  await prisma.user.update({
    where: { id },
    data: {
      banner: file.filename,
    },
  });
  res.send(file);

}

module.exports = {
  createUser, getAllUsers, getUserById, getUserByUsername, deleteUser, modifyUser,
  userLogin, verifyToken, getUserCategories, modifyPassword, updateProfilePhoto, updateBanner
}

