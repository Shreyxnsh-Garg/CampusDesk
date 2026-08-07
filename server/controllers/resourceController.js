const Resource = require("../models/Resource");

// =======================
// Add Resource
// =======================
const addResource = async (req, res) => {
  try {

    const {
      name,
      type,
      location,
      capacity,
      quantity
    } = req.body;

    if (!name || !type) {
      return res.status(400).json({
        success: false,
        message: "Name and Type are required."
      });
    }

    const resource = await Resource.create({
      name,
      type,
      location,
      capacity,
      quantity
    });

    res.status(201).json({
      success: true,
      message: "Resource added successfully.",
      resource
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }
};

// =======================
// Get All Resources
// =======================
const getAllResources = async (req, res) => {
  try {

    const resources = await Resource.find({
      isActive: true
    }).sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: resources.length,
      resources
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }
};

// =======================
// Get Single Resource
// =======================
const getResourceById = async (req, res) => {
  try {

    const resource = await Resource.findById(req.params.id);

    if (!resource || !resource.isActive) {
      return res.status(404).json({
        success: false,
        message: "Resource not found."
      });
    }

    res.status(200).json({
      success: true,
      resource
    });
    

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }
};

// =======================
// Update Resource
// =======================
const updateResource = async (req, res) => {
  try {

    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found."
      });
    }

    res.status(200).json({
      success: true,
      message: "Resource updated successfully.",
      resource
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }
};

// =======================
// Delete Resource
// =======================
const deleteResource = async (req, res) => {
  try {

    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found."
      });
    }

    resource.isActive = false;

await resource.save();

res.status(200).json({
    success: true,
    message: "Resource deleted successfully."
});

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }
};
module.exports = {
    addResource,
    getAllResources,
    getResourceById,
    updateResource,
    deleteResource
};
