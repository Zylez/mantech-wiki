// Discord Activity Function
function loadDiscordActivity() {
    const apiUrl = 'https://man.servegame.com/api/discord-activity';
    const messagesContainer = document.getElementById('discord-messages');
    const countContainer = document.getElementById('discord-count');
    
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success' && data.messages && data.messages.length > 0) {
                // Update message count
                countContainer.textContent = `${data.count} recent events`;
                
                // Clear loading message
                messagesContainer.innerHTML = '';
                
                // Add each message
                data.messages.forEach(message => {
                    const messageElement = document.createElement('div');
                    messageElement.className = 'discord-message';
                    
                    // Format timestamp to be more readable
                    const timestamp = new Date(message.timestamp);
                    const formattedTime = timestamp.toLocaleDateString() + ' ' + 
                                         timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                    
                    messageElement.innerHTML = `
                        <div class="discord-timestamp">${formattedTime}</div>
                        <div class="discord-content">${escapeHtml(message.content)}</div>
                    `;
                    
                    messagesContainer.appendChild(messageElement);
                });
            } else {
                messagesContainer.innerHTML = '<p>No recent activity</p>';
                countContainer.textContent = '0 events';
            }
        })
        .catch(error => {
            messagesContainer.innerHTML = '<p>Error loading Discord activity</p>';
            countContainer.textContent = 'Error';
            console.error('Discord activity error:', error);
        });
}

function getServerStatus() {
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
                        <li><p><b>Players online:</b> ${data.player_count}</p></li>
                        <li><p><b>IP:</b> ${data.server_ip}</p></li>
                        <li><p><b>Version:</b> ${data.version}</p></li>
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
}

// Helper function to escape HTML (prevents XSS and ensures proper rendering)
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Your existing server status code here
    
    // Load Discord activity
    loadDiscordActivity();
    getServerStatus();
});