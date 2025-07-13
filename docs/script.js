document.addEventListener('DOMContentLoaded', function() {
    const apiUrl = 'https://man.servegame.com/api/minecraft-status';
    
    const statusDiv = document.getElementById('serverstatus');
    
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.online) {
                statusDiv.innerHTML = `
                    <ul>
                        <li><p><b>Status:</b> <span style="color: green;">Online</span></p></li>
                        <li><p><b>Players:</b> ${data.player_count}</p></li>
                        <li><p><b>IP:</b> ${data.server_ip}</p></li>
                    </url>
                `;
            } else {
                statusDiv.innerHTML = `
                    <p>Status: <span style="color: red;">Offline</span></p>
                `;
            }
        })
        .catch(error => {
            statusDiv.innerHTML = 
                '<p><b>Error fetching server status</b></p>';
            console.error('Error:', error);
        });
});
