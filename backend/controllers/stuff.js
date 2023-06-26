//Logique métier
const Book = require("../models/book");

exports.createThing = (req, res, next) => {
  try {
    if (!req.body.book) {
      throw new Error(
        "La propriété 'book' est requise dans le corps de la requête."
      );
    }

    const bookObject = JSON.parse(req.body.book);
    const book = new Book({
      ...bookObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`,
      ratings: [],
      averageRating: 0,
    });

    book
      .save()
      .then(() => {
        res.status(201).json({ message: "Livre enregistré !" });
      })
      .catch((error) => {
        res.status(400).json({ error });
      });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.modifyThing = (req, res, next) => {
  const updateData = { ...req.body };
  if (req.file) {
    updateData.imageUrl = `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`;
  }

  Book.updateOne({ _id: req.params.id, userId: req.auth.userId }, updateData)
    .then(() => res.status(200).json({ message: "Livre modifié !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteThing = (req, res, next) => {
  Book.deleteOne({ _id: req.params.id, userId: req.auth.userId })
    .then(() => res.status(200).json({ message: "Livre supprimé !" }))
    .catch((error) => res.status(404).json({ error }));
};

exports.getOneThing = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (!book) {
        return res.status(404).json({ error: "Livre non trouvé !" });
      }
      res.status(200).json(book);
    })
    .catch((error) => res.status(404).json({ error }));
};

exports.getAllThings = (req, res, next) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};
