import Joi from "joi";

export const createCapituloSchema = Joi.object({
    titulo: Joi.string().trim().required().messages({
        "string.base": "El título debe ser texto",
        "string.empty": "El título no puede estar vacío",
        "any.required": "El título es obligatorio"
    }),

    contenido: Joi.string().trim().required().messages({
        "string.base": "El contenido debe ser texto",
        "string.empty": "El contenido no puede estar vacío",
        "any.required": "El contenido es obligatorio"
    }),

});

export const updateCapituloSchema = Joi.object({
    titulo: Joi.string().trim().optional().messages({
        "string.base": "El título debe ser texto",
        "string.empty": "El título no puede estar vacío"
    }),

    contenido: Joi.string().trim().optional().messages({
        "string.base": "El contenido debe ser texto",
        "string.empty": "El contenido no puede estar vacío"
    }),

}).min(1).messages({
    "object.min": "Debes enviar al menos un campo para actualizar"
});