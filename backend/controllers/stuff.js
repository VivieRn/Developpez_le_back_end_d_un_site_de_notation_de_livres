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

exports.getBestrating = (req, res, next) => {
  Book.find()
    .sort({ averageRating: -1 }) // Trie les livres par note moyenne décroissante
    .limit(3) // Récupère seulement les 3 premiers livres
    .then((books) => {
      res.status(200).json(books);
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.setBookRating = (req, res, next) => {
  const { userId, rating } = req.body;

  // Vérifier si la note est valide (comprise entre 0 et 5)
  if (rating < 0 || rating > 5) {
    return res
      .status(400)
      .json({ error: "La note doit être comprise entre 0 et 5." });
  }

  // Rechercher le livre par son ID
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (!book) {
        return res.status(404).json({ error: "Livre non trouvé !" });
      }

      // Vérifier si l'utilisateur a déjà noté ce livre
      const existingRating = book.ratings.find((r) => r.userId === userId);
      if (existingRating) {
        return res.status(400).json({ error: "Vous avez déjà noté ce livre." });
      }

      // Ajouter la nouvelle note à l'array "ratings" du livre
      book.ratings.push({ userId, grade: rating });

      // Recalculer la moyenne des notes
      const totalRatings = book.ratings.length;
      const sumRatings = book.ratings.reduce((sum, r) => sum + r.grade, 0);
      book.averageRating = sumRatings / totalRatings;

      // Sauvegarder les modifications du livre
      book
        .save()
        .then((updatedBook) => {
          res.status(200).json(updatedBook);
        })
        .catch((error) => {
          res
            .status(500)
            .json({
              error:
                "Une erreur s'est produite lors de la sauvegarde du livre.",
            });
        });
    })
    .catch((error) => {
      res
        .status(500)
        .json({
          error: "Une erreur s'est produite lors de la recherche du livre.",
        });
    });
};
