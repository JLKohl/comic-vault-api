const express = require('express');
const router = express.Router();
const placesController = require('../controllers/placesController');
const { validators } = require('../validation/placesValidation');
const { ensureAuthenticated } = require('../middleware/authMiddleware');

router.get(
	'/',
	/* #swagger.tags = ['Place']
		 #swagger.path = '/api/places'
	*/
	placesController.getAllPlaces
);

router.get(
	'/:id',
	/* #swagger.tags = ['Place']
		 #swagger.path = '/api/places/{id}'
		 #swagger.parameters['id'] = {
				in: 'path',
				description: 'Place ID',
				required: true,
				type: 'string'
		 }
	*/
	validators.getById,
	placesController.getPlaceById
);

router.post(
	'/',
	/* #swagger.tags = ['Place']
		 #swagger.path = '/api/places'
		 #swagger.requestBody = {
				required: true,
				content: {
					"application/json": {
						schema: {
							type: "object",
							properties: {
								name: { type: "string", example: "New York" },
								type: { type: "string", example: "City" },
								description: { type: "string", example: "A large metropolitan area" },
								population: { type: "number", example: 8400000 },
								technologyLevel: { type: "string", example: "Advanced" },
								notableLocations: {
									type: "array",
									items: { type: "string" },
									example: ["Downtown", "Harbor"]
								}
							},
							required: ["name", "type"]
						}
					}
				}
		 }
	*/
	ensureAuthenticated,
	validators.create,
	placesController.createPlace
);

router.put(
	'/:id',
	/* #swagger.tags = ['Place']
		 #swagger.path = '/api/places/{id}'
		 #swagger.parameters['id'] = {
				in: 'path',
				description: 'Place ID',
				required: true,
				type: 'string'
		 }
		 #swagger.requestBody = {
				required: true,
				content: {
					"application/json": {
						schema: {
							type: "object",
							properties: {
								name: { type: "string", example: "Updated Place Name" },
								type: { type: "string", example: "Planet" },
								description: { type: "string", example: "Updated description" },
								population: { type: "number", example: 12000000 },
								technologyLevel: { type: "string", example: "Post-scarcity" },
								notableLocations: {
									type: "array",
									items: { type: "string" },
									example: ["Capital District", "Orbital Port"]
								}
							}
						}
					}
				}
		 }
	*/
	ensureAuthenticated,
	validators.update,
	placesController.updatePlace
);

router.delete(
	'/:id',
	/* #swagger.tags = ['Place']
		 #swagger.path = '/api/places/{id}'
		 #swagger.parameters['id'] = {
				in: 'path',
				description: 'Place ID',
				required: true,
				type: 'string'
		 }
	*/
	ensureAuthenticated,
	validators.delete,
	placesController.deletePlace
);

module.exports = router;
