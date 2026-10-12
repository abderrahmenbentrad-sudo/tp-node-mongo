
const express = require('express');
const router = express.Router();

const Consultation = require('../models/Consultation');
const Patient = require('../models/Patient');

// 1. Ajouter une consultation
router.post('/', async (req, res) => {
  try {
    const { date, motif, diagnostic, patient } = req.body;

    const patientExiste = await Patient.findById(patient);

    if (!patientExiste) {
      return res.status(404).json({
        message: 'Patient introuvable'
      });
    }

    const consultation = await Consultation.create({
      date,
      motif,
      diagnostic,
      patient
    });

    res.status(201).json(consultation);
  } catch (error) {
    res.status(400).json({
      message: 'Erreur lors de la création',
      error: error.message
    });
  }
});

// 2. Afficher toutes les consultations
router.get('/', async (req, res) => {
  try {
    const consultations = await Consultation.find()
      .populate('patient');

    res.json(consultations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Afficher une consultation par ID
router.get('/:id', async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.id)
      .populate('patient');

    if (!consultation) {
      return res.status(404).json({
        message: 'Consultation introuvable'
      });
    }

    res.json(consultation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 4. Modifier une consultation
router.put('/:id', async (req, res) => {
  try {
    if (req.body.patient) {
      const patientExiste = await Patient.findById(req.body.patient);

      if (!patientExiste) {
        return res.status(404).json({
          message: 'Patient introuvable'
        });
      }
    }

    const consultation = await Consultation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!consultation) {
      return res.status(404).json({
        message: 'Consultation introuvable'
      });
    }

    res.json(consultation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 5. Supprimer une consultation
router.delete('/:id', async (req, res) => {
  try {
    const consultation = await Consultation.findByIdAndDelete(
      req.params.id
    );

    if (!consultation) {
      return res.status(404).json({
        message: 'Consultation introuvable'
      });
    }

    res.json({ message: 'Consultation supprimée avec succès' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
