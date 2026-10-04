const mongoose = require('mongoose');

const knowledgeDocumentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  authority: {
    type: String,
    required: true,
    default: 'SEBI'
  },
  sourceName: {
    type: String,
    required: true
  },
  sourceType: {
    type: String,
    default: 'regulatory_circular'
  },
  hash: {
    type: String,
    required: true
  },
  chunksCount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['indexed', 'failed', 'outdated'],
    default: 'indexed'
  },
  lastIndexed: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.models.KnowledgeDocument || mongoose.model('KnowledgeDocument', knowledgeDocumentSchema);
