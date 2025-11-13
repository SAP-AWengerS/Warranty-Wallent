const { default: mongoose } = require("mongoose");
const Warranty = require("../models/warranty-model");
const aws = require("aws-sdk");
const multer = require("multer");
const User = require("../models/user-model");

const s3 = new aws.S3({
  region: "eu-north-1",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  signatureVersion: "v4",
});

// Uploads a file to S3
const uploadInvoice = async (file) => {

  const params = {
    Bucket: "warranty-wallet",
    Key: `${Date.now()}-${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  const data = await s3.upload(params).promise();
  return data.Location;
};

const addWarranty = async (req, res) => {
  try {
    const {
      itemName = '',
      category = '',
      warrantyProvider = '',
      purchasedOn = null,  
      expiresOn = null,   
      createdAt = new Date(), 
      description = '',
      addedBy = '',
    } = req.body;
    const file = req.file;

    let invoiceURL = "";

    if (file) {
      invoiceURL = await uploadInvoice(file);
    }

    const newWarranty = new Warranty({
      itemName: itemName || "",
      category: category || "",
      warrantyProvider: warrantyProvider || "",
      purchasedOn: purchasedOn,
      expiresOn: expiresOn,
      createdAt: createdAt || new Date(),
      description: description || "",
      addedBy: addedBy || "",
      invoiceURL: invoiceURL || "",
    });

    const user = await User.findOne({ googleId: addedBy });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Save the new warranty
    await newWarranty.save();

    // Fetch all warranties for the user after adding the new one
    const warranties = await getAllWarrantyByUserHelper(addedBy);

    // Send the response with all warranties
    res.status(201).json({
      message: "Warranty added successfully",
      warranties,
    });
    
  } catch (error) {
    console.error("Error adding warranty:", error);
    res.status(500).json({ message: "Failed to add warranty", error: error.message });
  }
};


// Fetches warranty by ID
const getWarrantyById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid warranty ID" });
    }

    const warranty = await Warranty.findById(id).lean();

    if (!warranty) {
      return res.status(404).json({ message: "Warranty not found" });
    }

    res.status(200).json(warranty);
  } catch (error) {
    console.error("Error fetching warranty by ID:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch warranty", error: error.message });
  }
};

const getAllWarrantyByUser = async (req, res) => {
  try {
    const { addedBy } = req.params;

    // Find the user by googleId, expecting only one user
    const user = await User.findOne({ googleId: addedBy });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userEmail = user.email; // Directly access the email field

    // Retrieve warranties added by the user and those shared with the user
    const userWarranties = await Warranty.find({ addedBy });
    const sharedWarranties = await Warranty.find({ sharedWith: userEmail });

    const warranties = [...userWarranties, ...sharedWarranties];

    if (warranties.length === 0) {
      return res
        .status(404)
        .json({ message: "No warranties found for this user" });
    }

    const today = new Date();
    const enrichedWarranties = warranties.map((warranty) => {
      const purchasedOn = new Date(warranty.purchasedOn);
      const expiresOn = new Date(warranty.expiresOn);

      const totalDays = Math.ceil(
        (expiresOn - purchasedOn) / (1000 * 60 * 60 * 24)
      );
      const daysLeft = Math.max(
        0,
        Math.ceil((expiresOn - today) / (1000 * 60 * 60 * 24))
      );
      const percentage =
        totalDays > 0 ? ((totalDays - daysLeft) / totalDays) * 100 : 100;

      return {
        ...warranty._doc,
        daysLeft,
        percentage: percentage.toFixed(2),
        addedByEmail: userEmail, // Add the user's email to each warranty record
      };
    });

    res.status(200).json(enrichedWarranties);
  } catch (error) {
    console.error("Error fetching warranties by user:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch warranties", error: error.message });
  }
};

const getAllWarrantyByUserHelper = async (addedBy) => {
  const user = await User.findOne({ googleId: addedBy });

  if (!user) {
    throw new Error("User not found");
  }

  const userEmail = user.email;

  const userWarranties = await Warranty.find({ addedBy });
  const sharedWarranties = await Warranty.find({ sharedWith: userEmail });

  const warranties = [...userWarranties, ...sharedWarranties];

  if (warranties.length === 0) {
    throw new Error("No warranties found for this user");
  }

  const today = new Date();
  const enrichedWarranties = warranties.map((warranty) => {
    const purchasedOn = new Date(warranty.purchasedOn);
    const expiresOn = new Date(warranty.expiresOn);

    const totalDays = Math.ceil(
      (expiresOn - purchasedOn) / (1000 * 60 * 60 * 24)
    );
    const daysLeft = Math.max(
      0,
      Math.ceil((expiresOn - today) / (1000 * 60 * 60 * 24))
    );
    const percentage =
      totalDays > 0 ? ((totalDays - daysLeft) / totalDays) * 100 : 100;

    return {
      ...warranty._doc,
      daysLeft,
      percentage: percentage.toFixed(2),
      addedByEmail: userEmail,
    };
  });

  return enrichedWarranties;
};


const shareAccess = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;

    // Find the warranty by ID
    const warranty = await Warranty.findById(id);
    if (!warranty) {
      return res.status(404).json({ message: "Warranty not found" });
    }

    // Check if access is already shared with this email
    if (warranty.sharedWith.includes(email)) {
      return res
        .status(400)
        .json({ message: "Access already shared with this email" });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User with this email not found" });
    }

    // Share access with the specified email
    warranty.sharedWith.push(email);
    await warranty.save();

    res
      .status(200)
      .json({
        message: "Access shared successfully",
        warranty
      });
  } catch (error) {
    console.error("Error sharing access:", error);
    res
      .status(500)
      .json({ message: "Failed to share access", error: error.message });
  }
};

// Revokes access by removing an email from the 'sharedWith' array
const revokeAccess = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;

    const warranty = await Warranty.findById(id);

    if (!warranty) {
      return res.status(404).json({ message: "Warranty not found" });
    }

    warranty.sharedWith = warranty.sharedWith.filter(
      (sharedEmail) => sharedEmail !== email
    );
    await warranty.save();

    res.status(200).json({
      message: "Access revoked successfully",
      warranty,
    });
  } catch (error) {
    console.error("Error revoking access:", error);
    res
      .status(500)
      .json({ message: "Failed to revoke access", error: error.message });
  }
};

const updateWarrantyById = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      itemName,
      category,
      warrantyProvider,
      purchasedOn,
      expiresOn,
      description,
      addedBy, // Ensure the addedBy field is available for querying user warranties
    } = req.body;
    const file = req.file;

    // Validate the warranty ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid warranty ID" });
    }

    console.log(req.body);
    

    // Update the invoice URL if a new file is provided
    let invoiceURL = req.body.invoiceURL;
    if (file) {
      invoiceURL = await uploadInvoice(file);
    }

    // Update the warranty
    const updatedWarranty = await Warranty.findByIdAndUpdate(
      { _id: id },
      {
        itemName,
        category,
        warrantyProvider,
        purchasedOn,
        expiresOn,
        description,
        invoiceURL,
      },
      { new: true } // Return the updated document
    );

    if (!updatedWarranty) {
      return res.status(404).json({ message: "Warranty not found" });
    }

    // Fetch all warranties for the user after the update
    const warranties = await getAllWarrantyByUserHelper(addedBy);

    // Send the response with all warranties (including the updated one)
    res.status(200).json({
      message: "Warranty updated successfully",
      warranty:updatedWarranty,
      warranties   
    });
  } catch (error) {
    console.error("Error updating warranty:", error);
    res
      .status(500)
      .json({ message: "Failed to update warranty", error: error.message });
  }
};

// Deletes a warranty by ID
const deleteWarrantyById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid warranty ID" });
    }

    const deletedWarranty = await Warranty.findByIdAndDelete(id);

    if (!deletedWarranty) {
      return res.status(404).json({ message: "Warranty not found" });
    }

    res.status(200).json({ message: "Warranty deleted" });
  } catch (error) {
    console.error("Error deleting warranty:", error);
    res
      .status(500)
      .json({ message: "Failed to delete warranty", error: error.message });
  }
};

// Fetches warranties expiring soon
const getExpiringWarrantiesByUser = async (req, res) => {
  try {
    const { addedBy } = req.params;
    
    const today = new Date();
    const tenDaysLater = new Date(today);
    tenDaysLater.setDate(today.getDate() + 10);

    const expiringWarranties = await Warranty.find({
      addedBy,
      expiresOn: { $gte: today, $lte: tenDaysLater },
    });

    if (expiringWarranties.length === 0) {
      return res
        .status(404)
        .json({
          message: "No warranties expiring in the next 10 days for this user",
        });
    }

    const result = expiringWarranties.map((warranty) => {
      const expiresOn = new Date(warranty.expiresOn);
      const daysLeft = Math.max(
        0,
        Math.ceil((expiresOn - today) / (1000 * 60 * 60 * 24))
      );

      return {
        itemName: warranty.itemName,
        daysLeft,
      };
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching expiring warranties by user:", error);
    res
      .status(500)
      .json({
        message: "Failed to fetch expiring warranties",
        error: error.message,
      });
  }
};

module.exports = {
  addWarranty,
  getWarrantyById,
  getAllWarrantyByUser,
  updateWarrantyById,
  deleteWarrantyById,
  uploadInvoice,
  getExpiringWarrantiesByUser,
  shareAccess,
  revokeAccess,
};
