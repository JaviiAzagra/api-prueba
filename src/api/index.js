const server = require('../../index');

const PORT = process.env.PORT || 3000;

// Iniciar el servidor
if (require.main === module) {
    server.listen(PORT, () => {
        console.log(`Server running on --> http://localhost:${PORT}`);
    });
}
