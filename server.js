// server.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const qrcode = require('qrcode-terminal');
const { Client, MessageMedia } = require('whatsapp-web.js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do WhatsApp Web Client
const client = new Client({
  puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

// Event handler para quando o QR code for gerado
client.on('qr', (qr) => {
  console.log('QR CODE GERADO! Escaneie com seu WhatsApp:');
  qrcode.generate(qr, { small: true });
});

// Event handler para quando o cliente estiver pronto
client.on('ready', () => {
  console.log('Cliente WhatsApp conectado e pronto!');
});

// Iniciar o cliente
client.initialize();

// Configuração do multer para upload de arquivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = './uploads';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5MB
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Apenas imagens são permitidas!'));
    }
    cb(null, true);
  }
});

// Servir arquivos estáticos
app.use(express.static('public'));

// Rota para a página principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Status da conexão WhatsApp
app.get('/api/status', (req, res) => {
  res.json({ 
    connected: client.info ? true : false,
    info: client.info ? {
      name: client.info.pushname,
      phone: client.info.wid.user
    } : null
  });
});

// Endpoint para processar e enviar figurinha
app.post('/api/send-sticker', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Nenhuma imagem enviada' });
    }

    const { destinationType, destination } = req.body;
    
    if (!destination) {
      return res.status(400).json({ success: false, message: 'Destino não especificado' });
    }

    // Verificar se o cliente WhatsApp está conectado
    if (!client.info) {
      return res.status(503).json({ 
        success: false, 
        message: 'Cliente WhatsApp não está conectado. Escaneie o QR code no console do servidor.' 
      });
    }

    // Caminho do arquivo original
    const filePath = req.file.path;
    
    // Caminho para o arquivo processado
    const processedPath = `./uploads/processed_${req.file.filename.split('.')[0]}.webp`;

    // Processar a imagem para o formato de figurinha (512x512 WebP)
    await sharp(filePath)
      .resize(512, 512, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .toFormat('webp')
      .toFile(processedPath);

    // Criar objeto MessageMedia para enviar como figurinha
    const media = MessageMedia.fromFilePath(processedPath);

    // Determinar o destino correto
    let chatId;
    if (destinationType === 'group') {
      // Para grupos, o ID deve incluir o sufixo @g.us
      chatId = destination.includes('@g.us') ? destination : `${destination}@g.us`;
    } else {
      // Para contatos individuais, o ID deve incluir o sufixo @c.us
      // Remover qualquer caractere não numérico do número de telefone
      const cleanNumber = destination.replace(/\D/g, '');
      chatId = cleanNumber.includes('@c.us') ? cleanNumber : `${cleanNumber}@c.us`;
    }

    // Enviar a figurinha
    await client.sendMessage(chatId, media, { sendMediaAsSticker: true });

    // Limpar arquivos temporários
    fs.unlinkSync(filePath);
    fs.unlinkSync(processedPath);

    res.status(200).json({ 
      success: true, 
      message: 'Figurinha enviada com sucesso!' 
    });
    
  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({ 
      success: false, 
      message: `Erro ao processar solicitação: ${error.message}` 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Acesse: http://localhost:${PORT}`);
});