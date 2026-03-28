const Issue = require('../models/issue');

// 1. GET all issues
exports.getAllIssues = async (req, res) => {
  try {
    const issues = await Issue.find();
    res.status(200).json(issues);
  } catch (err) {
    res.status(500).json({ message: "Error fetching issues", error: err.message });
  }
};

// 2. GET single issue by ID
exports.getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });
    res.status(200).json(issue);
  } catch (err) {
    res.status(500).json({ message: "Invalid ID format", error: err.message });
  }
};

// 3. POST - create new issue
exports.createIssue = async (req, res) => {
  try {
    const newIssue = new Issue(req.body);
    const savedIssue = await newIssue.save();
    res.status(201).json(savedIssue);
  } catch (err) {
    res.status(400).json({ message: "Error creating issue", error: err.message });
  }
};

// 4. PUT - update issue
exports.updateIssue = async (req, res) => {
  try {
    const updatedIssue = await Issue.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!updatedIssue) return res.status(404).json({ message: 'Issue not found' });
    res.status(200).json(updatedIssue);
  } catch (err) {
    res.status(400).json({ message: "Error updating issue", error: err.message });
  }
};

// 5. DELETE issue
exports.deleteIssue = async (req, res) => {
  try {
    const deletedIssue = await Issue.findByIdAndDelete(req.params.id);
    if (!deletedIssue) return res.status(404).json({ message: 'Issue not found' });
    res.status(200).json({ message: 'Issue deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: "Error deleting issue", error: err.message });
  }
};