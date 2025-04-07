// Verificar status da conexão
async function checkStatus() {
    try {
        const response = await fetch('/api/status');
        const data = await response.json();
        
        const statusDiv = document.getElementById('status');
        const submitBtn = document.getElementById('submitBtn');
        
        if (data.connected) {
            statusDiv.className = 'status connected';
            statusDiv.textContent = `Conectado como: ${data.info.name} (${data.info.phone})`;
            submitBtn.disabled = false;
        } else {
            statusDiv.className = 'status disconnected';
            statusDiv.textContent = 'Desconectado! Escaneie o QR code no console do servidor.';
            submitBtn.disabled = true;
        }
    } catch (error) {
        console.error('Erro ao verificar status:', error);
        document.getElementById('status').textContent = 'Erro ao verificar status de conexão';
    }
}

// Verificar status ao carregar a página
window.addEventListener('load', checkStatus);

// Verificar status periodicamente
setInterval(checkStatus, 10000);

// Preview da imagem
document.getElementById('imageFile').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            document.getElementById('imagePreview').src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Envio do formulário
document.getElementById('stickerForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData();
    const imageFile = document.getElementById('imageFile').files[0];
    const destinationType = document.getElementById('destinationType').value;
    const destination = document.getElementById('destination').value;
    
    if (!imageFile || !destination) {
        showResult('Preencha todos os campos', false);
        return;
    }
    
    formData.append('image', imageFile);
    formData.append('destinationType', destinationType);
    formData.append('destination', destination);
    
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';
    
    try {
        const response = await fetch('/api/send-sticker', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showResult('Figurinha enviada com sucesso!', true);
        } else {
            showResult(`Erro: ${data.message}`, false);
        }
    } catch (error) {
        showResult(`Erro ao conectar com o servidor: ${error.message}`, false);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enviar Figurinha';
    }
});

function showResult(message, isSuccess) {
    const resultDiv = document.getElementById('result');
    resultDiv.textContent = message;
    resultDiv.style.display = 'block';
    resultDiv.className = isSuccess ? 'result success' : 'result error';
    
    setTimeout(() => {
        resultDiv.style.display = 'none';
    }, 5000);
}