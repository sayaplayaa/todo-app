const { Router } = require('express');
const ctrl = require('../controllers/todo.controller');

const router = Router();

// Порядок важен: DELETE /api/todos должен быть до DELETE /api/todos/:id
router.get('/',     ctrl.getAll);
router.get('/stats', ctrl.getStats);
router.get('/:id',  ctrl.getOne);

router.post('/',    ctrl.create);
router.patch('/:id', ctrl.update);

router.delete('/',    ctrl.removeCompleted);
router.delete('/:id', ctrl.remove);

module.exports = router;
