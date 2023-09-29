const { response } = require('express');
const { prisma } = require('../database');

/**
 * @method POST
 * @name createComment
 * @description este es el metodo empleado para crear un nuevo comentario en un post
 * @params data: { title, description, media, createdAt }
 * @returns Comentario creado en la base de datos
 */

const createComment = async (req, res = response) => {
    const data = JSON.parse(JSON.stringify(req.body)); // Obtener datos del cuerpo de la solicitud
    try {
        const { userId, postId } = req.params;
        const parsedUserId = parseInt(userId);
        const parsedPostId = parseInt(postId);
        const createdComment = await prisma.comment.create({ // Crear un nuevo comentario en la base de datos utilizando los datos proporcionados
            data: {
                text: data.text,
                createdAt: data.createdAt,
                post: {
                    connect: { id: parsedPostId } // Conectar el comentario al post correspondiente
                },
                author: {
                    connect: { id: parsedUserId }, // Conectar el comentario al usuario correspondiente
                }
            },
        });
        // Obtener el post actualizado con el comentario agregado
        const updatedPost = await prisma.post.update({
            where: { id: parsedPostId },
            data: {
                comments: {
                    connect: { id: createdComment.id }  // Conectar el comentario creado con el post
                }
            },
            include: { comments: true } // Incluir los comentarios del post en la respuesta
        });

        const updatedUser = await prisma.user.update({
            where: { id: parsedUserId },
            data: {
                comments: {
                    connect: { id: createdComment.id }  // Conectar el comentario creado con el usuario
                }
            },
            include: { comments: true } // Incluir los comentarios del usuario en la respuesta
        });

        res.status(201).json({  // Devolver una respuesta con estado 201 indicando que el coomentario se creó exitosamente
            status: 201,
            message: 'Comentario creado con éxito',
            data: createdComment,
            post: updatedPost,
            user: updatedUser
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
 * @name getAllComments
 * @description obtiene todos los comentarios registrados en la Base de Datos
*/
const getAllComments = async (req, res = response) => {
    try {
        //con el metodo findmany traemos a los paquetes y los asignamos a data.
        //y prisma genera el query para la consulta
        const comments = await prisma.comment.findMany();
        res.status(200).json({
            status: 200,
            data: { comments },
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
 * @name getCommentsByPost
 * @description obtiene todos los comentarios registrados en la Base de Datos
*/
const getCommentsByPost = async (req, res = response) => {
    try {
        //con el metodo findmany traemos a los usuarios y los asignamos a data.
        //y prisma genera el query para la consulta
        let { postId } = req.params;
        postId = parseInt(postId);
        const comments = await prisma.comment.findMany({
            where: {
                postId: postId
            }
        });;
        res.status(200).json({
            status: 200,
            data: { comments },
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
 * @name getCommentsByUser
 * @description obtiene todos los comentarios registrados en la Base de Datos
*/
const getCommentsByUser = async (req, res = response) => {
    try {
        //con el metodo findmany traemos a los usuarios y los asignamos a data.
        //y prisma genera el query para la consulta
        let { userId } = req.params;
        userId = parseInt(userId);
        const comments = await prisma.comment.findMany({
            where: {
                authorId: userId
            }
        });;
        res.status(200).json({
            status: 200,
            data: { comments },
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
 * @name getCommentsByUserPost
 * @description obtiene todos los comentarios registrados en la Base de Datos
*/
const getCommentsByUserPost = async (req, res = response) => {
    try {
        //con el metodo findmany traemos a los usuarios y los asignamos a data.
        //y prisma genera el query para la consulta
        const { userId, postId } = req.params;
        const parsedUserId = parseInt(userId);
        const parsedPostId = parseInt(postId);
        const comments = await prisma.comment.findMany({
            where: {
                authorId: parsedUserId,
                postId: parsedPostId
            }
        });;
        res.status(200).json({
            status: 200,
            data: { comments },
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
* @description elimina un comentario especifico
* @name deleteComment
* @params { id: int }
*/
const deleteComment = async (req, res = response) => {
    const { userId, commentId } = req.params;
    const parsedUserId = parseInt(userId);
    const id = parseInt(commentId);
    try {
        // Llamamos a la función para obtener el comentario que buscamos
        const comment = await prisma.comment.findUnique({ where: { id } });
        // Si no existe en la base de datos, devuelve "comentario no encontrado"
        if (!comment) {
            res.status(404).json({
                status: 404,
                message: 'Comentario no encontrado',
            });
            return;
        }

        if (comment.authorId !== parsedUserId) { // Verificar si el usuario que hace la solicitud es el dueño del comentario
            return res.status(403).json({ // Devolver una respuesta con estado 403 indicando que el usuario no tiene permiso para eliminar el comentario
                status: 403,
                message: 'No tienes permiso para eliminar este comentario',
            });
        }

        // Si el comentario existe y el usuario es el dueño, se eliminan sus datos y relaciones en la base de datos
        await prisma.comment.delete({ where: { id: id } });
        res.status(200).json({
            status: 200,
            message: 'Comentario eliminado exitosamente',
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
 * @method PUT
 * @name updateComment
 * @description edita un post identificandolo por su id en la base de datos
 * @body {
  "text": "Este es un nuevo comentareio",
  "createdAt": "2023-04-11T10:30:00Z"
}
 * @params { id: int }
 */
const updateComment = async (req, res = response) => {
    const { userId, commentId } = req.params;
    const parsedUserId = parseInt(userId);
    const parsedCommentId = parseInt(commentId);
    const data = JSON.parse(JSON.stringify(req.body)); // Obtener datos del cuerpo de la solicitud

    try {
        const comment = await prisma.comment.findUnique({ // Buscar el comentario por su id
            where: { id: parsedCommentId }, // Especificar el id del comentario que se va a actualizar
        });

        if (!comment) { // Verificar si el comentario existe
            return res.status(404).json({ // Devolver una respuesta con estado 404 indicando que el comentario no fue encontrado
                status: 404,
                message: 'Comentario no encontrado',
            });
        }

        if (comment.authorId !== parsedUserId) { // Verificar si el usuario que hace la solicitud es el dueño del comentario
            return res.status(403).json({ // Devolver una respuesta con estado 403 indicando que el usuario no tiene permiso para editar el comentario
                status: 403,
                message: 'No tienes permiso para editar este comentario',
            });
        }

        const updatedComment = await prisma.comment.update({ // Utilizar el método update de Prisma para actualizar el comentario por su id
            where: { id: parsedCommentId }, // Especificar el id del comentario que se va a actualizar
            data: {
                text: data.text,
                createdAt: data.createdAt
            },
        });

        res.status(200).json({ // Devolver una respuesta con estado 200 indicando que el comentario se actualizó exitosamente
            status: 200,
            message: 'Comentario actualizado con éxito',
            data: updatedComment,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ // Devolver una respuesta con estado 500 indicando un error interno del servidor
            status: 500,
            message: 'Error interno del servidor',
        });
    }
};

module.exports = { createComment, getAllComments, getCommentsByPost, getCommentsByUser, getCommentsByUserPost, deleteComment, updateComment };
