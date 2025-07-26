document.addEventListener('DOMContentLoaded', function() {
    const apiUrl = 'https://man.servegame.com/api/minecraft-status';
    
    const statusDiv = document.getElementById('serverstatus');
    const announcementDiv = document.getElementById('announcement');
    
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Clear previous announcements
            announcementDiv.innerHTML = '';

            // Handle announcements
            if (data.announcements && data.announcements.length > 0) {
                data.announcements.forEach(announcement => {
                    const admonitionDiv = document.createElement('div');
                    admonitionDiv.className = `admonition ${announcement.type || 'note'}`;
                    admonitionDiv.innerHTML = `
                        <p class="admonition-title">${announcement.title || 'Announcement'}</p>
                        <p>${announcement.content}</p>
                    `;
                    announcementDiv.appendChild(admonitionDiv);
                });
            }

            // Handle server status
            if (data.online) {
                statusDiv.innerHTML = `
                    <ul>
                        <li><p><b>Status:</b> <span style="color: green;">Online</span></p></li>
                        <li><p><b>Players:</b> ${data.player_count}</p></li>
                        <li><p><b>Player last online:</b> ${data.time_since_last_player_formatted}</p></li>
                        <li><p><b>IP:</b> ${data.server_ip}</p></li>
                    </ul>
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