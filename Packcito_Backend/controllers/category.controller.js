const { response } = require('express');
const { prisma } = require('../database');

/**
 * @method POST
 * @name createCategory
 * @description este es el metodo empleado para crear una nueva categoria en la plataforma
 * @params data: { name, description, icon }
 * @returns Categoria creada en la base de datos
 */

const createCategory = async (req, res = response) => {
    //se parsean los datos que vienen del front end en formato json
    //de JSON a Objeto Javascript
    const data = JSON.parse(JSON.stringify(req.body));
    try {
        // Verificar que la categoria no está registrado
        const findCat = await prisma.category.findFirst({
            where: {
                name: data.name
            }
        });
        if (findCat) {
            res.status(400).json({
                status: 400,
                message: 'ya existe una categoria con este nombre.',
            });
            return;
        }
        //si no está registrada, se la crea y devuelve un mensaje al backend
        await prisma.category.create({ data })
        res.status(201).json({
            status: 201,
            message: 'categoria generada con exito',
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            message: 'internal server error',
        });
    };

};

/**
 * @method GET
 * @name getAllCategories
 * @description obtiene todos las categorias registrados en la Base de Datos
*/
const getAllCategories = async (req, res = response) => {
    try {
        //con el metodo findmany traemos a las categorias y las asignamos a data.
        //y prisma genera el query para la consulta
        const category = await prisma.category.findMany();
        res.status(200).json({
            status: 200,
            data: { category },
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
 * @name getCategoryById
 * @description retorna una categoria segun su id en la bdd; en caso de no existir el resultado es null
 * @params id: int
 * @returns {}category || null
 */
const getCategoryById = async (req, res = response) => {
    //con findunique buscamos un elemento dada una condicion, en este caso el id de usuario
    let { id } = req.params;
    id = parseInt(id);
    try {
      const category = await prisma.category.findUnique({ where: { id } });
      if (!category) {
        res.status(404).json({
          status: 404,
          message: 'categoria no encontrado',
        });
        return;
      }
      //devuelve los datos de la categoria en formato json.
      res.status(200).json({
        status: 200,
        data: { category },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: 500,
        message: 'internal server error',
      });
    }
  };


module.exports = {createCategory, getAllCategories, getCategoryById};
