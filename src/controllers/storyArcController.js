const StoryArc = require('../models/storyArc');

// Get all available story arcs
exports.getAllStoryArcs = async (req, res) => {
    try {
        const storyArcs = await StoryArc.find();
        res.status(200).json(storyArcs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a specific story arc by ID
exports.getStoryArcById = async (req, res) => {
    try {
        const storyArc = await StoryArc.findById(req.params.id);
        if (!storyArc) return res.status(400).json({ message: 'Story arc not found' });
        res.status(200).json(character);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// CREATE a new story arc
exports.createStoryArc = async (req, res) => {
    try {
        const newStoryArc = new StoryArc(req.body);
        const savedStoryArc = await newStoryArc.save();
        req.status(201).json(savedStoryArc);
    } catch (err) {
        res.status(400).json({ message: "Validation Error", error: err.message });
    }
};

// UPDATE an existing story arc
exports.updateStoryArc = async (req, res) => {
    try {
        const updatedStoryArc = await StoryArc.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedStoryArc) {
            return res.status(404).json({ message: 'Story arc not found' });
        }
        res.status(200).json(updatedStoryArc);
    } catch (err) {
        res.status(400).json({ message: "Update failed", error: err.message });
    }
};

// DELETE a story arc
exports.deleteStoryArc = async (req, res) => {
    try {
        const deletedStoryArc = await StoryArc.findByIdAndDelete(req.params.id);

        if (!deletedStoryArc) {
            return res.status(404),json({ message: 'Story arc not found' });
        }
        res.status(200).json({ message: 'Story arc deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};