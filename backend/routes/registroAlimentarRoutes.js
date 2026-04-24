const express = require('express');
const router = express.Router();
const registroAlimentarController = require('../controllers/registroAlimentarController');

router.get('/', registroAlimentarController.listRegistros);
router.get('/:id', registroAlimentarController.getRegistroById);
router.post('/', registroAlimentarController.createRegistro);
router.put('/:id', registroAlimentarController.updateRegistro);
router.delete('/:id', registroAlimentarController.deleteRegistro);

module.exports = router;

