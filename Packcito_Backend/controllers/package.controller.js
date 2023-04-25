const { response } = require('express');
const { prisma } = require('../database');

/**
 * @method POST
 * @name createPackage
 * @description Este es el método empleado para crear un nuevo paquete para el usuario
 * @params {idUser: int}
 * @body data: {
  "title": "nombre del paquete",
  "description": "Descripción actualizada del paquete",
  "icon": "icono del paquete",
  "price": precio del paquete,
  "categories": [categorias del paquete],
  "packageValoration": 0
}
 * @returns Paquete creado en la base de datos
 */
const createPackage = async (req, res = response) => {
    let { idUser } = req.params;
    idUser = parseInt(idUser);
    const data = JSON.parse(JSON.stringify(req.body)); // Obtener datos del cuerpo de la solicitud
    try {
        const file = req.file;
        const icon = file ? file.filename : "defaultPackage.png";
        const createdPackage = await prisma.package.create({ // Crear un nuevo paquete en la base de datos utilizando los datos proporcionados
            data: {
                title: data.title,
                description: data.description,
                icon: icon, // Guardar el nombre del archivo en el campo "icon"
                price: Number(data.price),
                authorId: idUser,
                valoration: 0
            },
        });

        // Obtener el usuario actualizado con el paquete creado
        const updatedUser = await prisma.user.update({
            where: { id: idUser },
            data: {
                packages: {
                    connect: { id: createdPackage.id }  // Conectar el paquete creado con el usuario
                }
            },
            include: { packages: true } // Incluir los paquetes del usuario en la respuesta
        });

        res.status(201).json({  // Devolver una respuesta con estado 201 indicando que el paquete se creó exitosamente
            status: 201,
            message: 'Paquete creado con éxito',
            data: createdPackage,
            user: updatedUser // Incluir el usuario actualizado en la respuesta
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
 * @name getAllPacksByUser
 * @description obtiene todos los paquetes de un usuario.
*/
const getAllPacksByUser = async (req, res = response) => {
    try {
        //con el metodo findmany traemos a los usuarios y los asignamos a data.
        //y prisma genera el query para la consulta
        let { idUser } = req.params;
        idUser = parseInt(idUser);
        const packages = await prisma.package.findMany({
            where: {
                authorId: idUser
            }
        });;
        res.status(200).json({
            status: 200,
            data: { packages },
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
 * @name getAllPackages
 * @description obtiene todos los paquetes registrados en la Base de Datos
*/
const getAllPackages = async (req, res = response) => {
    try {
        //con el metodo findmany traemos a los paquetes y los asignamos a data.
        //y prisma genera el query para la consulta
        const packages = await prisma.package.findMany();
        res.status(200).json({
            status: 200,
            data: { packages },
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
 * @name getPackageByUser
 * @description Obtiene un paquete específico de un usuario específico en la Base de Datos
 */
const getPackageByUser = async (req, res) => {
    try {
        const packageId  = req.params.packageId;
        const parsedPackageId = parseInt(packageId);
        console.log(parsedPackageId)

        // Utilizar la función findFirst de Prisma con una consulta que incluya cláusulas where para filtrar el usuario y el paquete específico
        const package = await prisma.package.findFirst({
            where: {
                id: parsedPackageId,
            }
        });

        // Manejar el caso en el que no se encuentre el paquete
        if (!package) {
            return res.status(404).json({ error: 'Paquete no encontrado' });
        }

        // Devolver el paquete encontrado
        return res.status(200).json(package);
    } catch (error) {
        // Manejar cualquier error de Prisma u otro error
        console.error(error);
        return res.status(500).json({ error: 'Error al obtener el paquete' });
    }
};

/**
* @method DELETE
* @description elimina un paquete especifico
* @name deletePackage
* @params { id: int }
*/
const deletePackage = async (req, res = response) => {
    let { packageId } = req.params;
    id = parseInt(packageId);
    try {
        //llamamos a la funcion para obtener el paquete que buscamos
        const user = await prisma.package.findUnique({ where: { id } });
        //si no existe en la base de datos nos devuelve paquete no encontrado
        if (!user) {
            res.status(404).json({
                status: 404,
                message: 'paquete no existente',
            });
            return;
        }
        //si el paquete existe, se eliminan sus datos y relaciones en la base de datos
        await prisma.package.delete({ where: { id: id } });
        res.status(200).json({
            status: 200,
            message: 'paquete eliminado con exito',
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
 * @name updatePackage
 * @description edita un paquete identificandolo por su id en la base de datos
 * @body {
  "title": "nombre del paquete",
  "description": "Descripción actualizada del paquete",
  "icon": "icono del paquete",
  "price": precio del paquete,
  "packageValoration": 0
}
 * @params { id: int }
 */
  const updatePackage = async (req, res = response) => {
    let { packageId } = req.params;
    id = parseInt(packageId);
    const data = JSON.parse(JSON.stringify(req.body)); // Obtener datos del cuerpo de la solicitud
    try {
        const updatedPackage = await prisma.package.update({ // Utilizar el método update de Prisma para actualizar el paquete por su id
            where: { id }, // Especificar el id del paquete que se va a actualizar
            data: {
                title: data.title,
                description: data.description,
                icon: data.icon,
                price: data.price,
            },
        });

        res.status(200).json({  // Devolver una respuesta con estado 200 indicando que el paquete se actualizó exitosamente
            status: 200,
            message: 'Paquete actualizado con éxito',
            data: updatedPackage,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            message: 'Error interno del servidor',
        });
    }
};


module.exports = { createPackage, getAllPacksByUser, getPackageByUser, getAllPackages, deletePackage, updatePackage } // Se corrige el error en la exportación del método