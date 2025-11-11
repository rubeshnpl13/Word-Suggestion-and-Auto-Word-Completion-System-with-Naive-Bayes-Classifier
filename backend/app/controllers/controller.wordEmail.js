const WordEmail = require("../models/model.wordEmail");
exports.saveWordEmail = async (req, res) => {
  const { word, email, increment } = req.body;

  try {
    if (increment) {
      // Update the existing record by incrementing the count
      const updatedWordEmail = await WordEmail.findOneAndUpdate(
        { word, email },
        { $inc: { count: 1 } },
        { new: true }
      );

      // If the word doesn't exist for the given email, create a new record
      if (!updatedWordEmail) {
        const newWordEmail = new WordEmail({ word, email, count: 1 });
        await newWordEmail.save();
        res.status(201).json({ message: "New word and email saved." });
      } else {
        res.status(200).json({ message: "Word count incremented." });
      }
    } else {
      const newWordEmail = new WordEmail({ word, email, count: 1 });
      await newWordEmail.save();
      res.status(201).json({ message: "New word and email saved." });
    }
  } catch (err) {
    console.error("Error details:", err);
    res.status(500).json({ message: "Error saving word and email." });
  }
};

exports.getSavedWordsByEmail = async (req, res) => {
  try {
    const email = req.params.email;
    const savedWords = await WordEmail.find({ email: email });

    res.json(savedWords);
  } catch (error) {
    console.error("Error fetching saved words by email:", error);
    res.status(500).json({ error: "Error fetching saved words by email" });
  }
};
