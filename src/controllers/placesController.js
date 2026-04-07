const Place = require('../models/places');

// Get all places
exports.getAllPlaces = async (req, res) => {
	try {
		const places = await Place.find();
		res.status(200).json(places);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

// Get a specific place by ID
exports.getPlaceById = async (req, res) => {
	try {
		const place = await Place.findById(req.params.id);
		if (!place) return res.status(404).json({ message: 'Place not found' });
		res.status(200).json(place);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

// Create a new place
exports.createPlace = async (req, res) => {
	try {
		const newPlace = new Place(req.body);
		const savedPlace = await newPlace.save();
		res.status(201).json(savedPlace);
	} catch (err) {
		res.status(400).json({ message: 'Validation Error', error: err.message });
	}
};

// Update an existing place
exports.updatePlace = async (req, res) => {
	try {
		const updatedPlace = await Place.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});

		if (!updatedPlace) {
			return res.status(404).json({ message: 'Place not found' });
		}
		res.status(200).json(updatedPlace);
	} catch (err) {
		res.status(400).json({ message: 'Update failed', error: err.message });
	}
};

// Delete a place
exports.deletePlace = async (req, res) => {
	try {
		const deletedPlace = await Place.findByIdAndDelete(req.params.id);

		if (!deletedPlace) {
			return res.status(404).json({ message: 'Place not found' });
		}
		res.status(200).json({ message: 'Place deleted successfully' });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};
