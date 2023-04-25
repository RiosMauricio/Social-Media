const { response } = require('express');
const { prisma } = require('../database');

/**
 * @method POST
 * @name createPost
 * @description este es el metodo empleado para crear una nueva publicacion en un paquete
 * @params data: { title, description, media, createdAt }
 * @returns Post creado en la base de datos
 */

const createPost = async (req, res = response) => {
    const data = JSON.parse(JSON.stringify(req.body)); // Obtener datos del cuerpo de la solicitud
    try {
        let { idPackage } = req.params;
        idPackage = parseInt(idPackage);
        const mediaFiles = req.files.map((file) => file.filename); // Obtener los nombres de archivo de los archivos cargados
        const createdPost = await prisma.post.create({ // Crear un nuevo post en la base de datos utilizando los datos proporcionados
            data: {
                title: data.title,
                description: data.description, 
                media: mediaFiles.join(';'), // Convertir la lista de nombres de archivo en una cadena separada por comas
                createdAt: data.createdAt, 
                valoration: data.valoration, 
                package: {
                    connect: { id: idPackage } // Conectar el post al paquete correspondiente
                }
            },
        });
        // Obtener el paquete actualizado con el post creado
        const updatedPackage = await prisma.package.update({
            where: { id: idPackage },
            data: {
                posts: {
                    connect: { id: createdPost.id }  // Conectar el post creado con el paquete
                }
            },
            include: { posts: true } // Incluir los post del paquete en la respuesta
        });

        res.status(201).json({  // Devolver una respuesta con estado 201 indicando que el post se creó exitosamente
            status: 201,
            message: 'Post creado con éxito',
            data: createdPost,
            package: updatedPackage
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
 * @method GET
 * @name getAllPostsByPackage
 * @description obtiene todos los posts de un paquete.
*/
const getAllPostsByPackage = async (req, res = response) => {
    try {
        //con el metodo findmany traemos al paquete y los asignamos a data.
        //y prisma genera el query para la consulta
        let { idPackage } = req.params;
        idPackage = parseInt(idPackage);
        const posts = await prisma.post.findMany({
            where: {
                packageId: idPackage
            }
        });;
        res.status(200).json({
            status: 200,
            data: { posts },
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
 * @name getPostByPackage
 * @description Obtiene un post específico de un paquete específico en la Base de Datos
 */
const getPostsByPackage = async (req, res) => {
    try {
        const { packageId, postId } = req.params;
        const parsedpackageId = parseInt(packageId);
        const parsedpostId = parseInt(postId);

        // Utilizar la función findFirst de Prisma con una consulta que incluya cláusulas where para filtrar el paquete y el post específico
        const post = await prisma.post.findFirst({
            where: {
                id: parsedpostId,
                packageId: parsedpackageId
            }
        });

        // Manejar el caso en el que no se encuentre el post
        if (!post) {
            return res.status(404).json({ error: 'Post no encontrado' });
        }

        // Devolver el post encontrado
        return res.status(200).json(post);
    } catch (error) {
        // Manejar cualquier error de Prisma u otro error
        console.error(error);
        return res.status(500).json({ error: 'Error al obtener el paquete' });
    }
};

/**
 * @method GET
 * @name getAllPosts
 * @description obtiene todos los posts registrados en la Base de Datos
*/
const getAllPosts = async (req, res = response) => {
    try {
        //con el metodo findmany traemos a los paquetes y los asignamos a data.
        //y prisma genera el query para la consulta
        const posts = await prisma.post.findMany();
        res.status(200).json({
            status: 200,
            data: { posts },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            message: 'internal server error',
        });
    }
};


const getPost = async (req, res) => {
    //con findunique buscamos un elemento dada una condicion, en este caso el id de usuario
    let { postId } = req.params;
    postId = parseInt(postId);
    try {
      const post = await prisma.post.findUnique({ where: { id: postId  } });
      if (!post) {
        res.status(404).json({
          status: 404,
          message: 'post no encontrado',
        });
        return;
      }
      //devuelve los datos del usuario en formato json.
      res.status(200).json({
        status: 200,
        data: { post },
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
* @method DELETE
* @description elimina un post especifico
* @name deletePost
* @params { id: int }
*/
const deletePost= async (req, res = response) => {
    let { postId } = req.params;
    id = parseInt(postId);
    try {
        //llamamos a la funcion para obtener el post que buscamos
        const post = await prisma.post.findUnique({ where: { id } });
        //si no existe en la base de datos nos devuelve post no encontrado
        if (!post) {
            res.status(404).json({
                status: 404,
                message: 'post no existente',
            });
            return;
        }
        //si el post existe, se eliminan sus datos y relaciones en la base de datos
        await prisma.post.delete({ where: { id: id } });
        res.status(200).json({
            status: 200,
            message: 'post eliminado con exito',
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
 * @name updatePost
 * @description edita un post identificandolo por su id en la base de datos
 * @body {
    "title": "Nuevo título",
    "description": "Nueva descripción",
    "media": "Nuevos medios",
    "createdAt": "2023-04-12T10:30:00Z",
}
 * @params { id: int }
 */
const updatePost = async (req, res = response) => {
    let { postId } = req.params;
    id = parseInt(postId);
    const data = JSON.parse(JSON.stringify(req.body)); // Obtener datos del cuerpo de la solicitud
    try {
        const updatedPost= await prisma.post.update({ // Utilizar el método update de Prisma para actualizar el paquete por su id
            where: { id }, // Especificar el id del paquete que se va a actualizar
            data: {
                title: data.title,
                description: data.description,
                media: data.media, 
                createdAt: data.createdAt, 
                valoration: data.valoration
            },
        });

        res.status(200).json({  // Devolver una respuesta con estado 200 indicando que el paquete se actualizó exitosamente
            status: 200,
            message: 'Paquete actualizado con éxito',
            data: updatedPost,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            message: 'Error interno del servidor',
        });
    }
};
module.exports = { createPost, getPost, getAllPostsByPackage, getPostsByPackage, deletePost, updatePost, getAllPosts };
