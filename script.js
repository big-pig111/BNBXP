// Windows XP Simulator JavaScript

class WindowsXP {
    constructor() {
        this.windows = [];
        this.activeWindow = null;
        this.windowCounter = 0;
        this.isDragging = false;
        this.dragOffset = { x: 0, y: 0 };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateClock();
        this.setupDesktopIcons();
        this.setupWindowManagement();
        
        // Set desktop icon positions
        this.positionDesktopIcons();
    }

    setupEventListeners() {
        // Start button
        document.getElementById('start-button').addEventListener('click', () => {
            this.toggleStartMenu();
        });

        // All programs menu
        document.getElementById('all-programs').addEventListener('click', () => {
            this.showAllProgramsMenu();
        });

        // Return to start menu
        document.getElementById('all-programs-menu').querySelector('.submenu-header').addEventListener('click', () => {
            this.hideAllProgramsMenu();
        });

        // Application launch
    document.querySelectorAll('.submenu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const app = e.currentTarget.dataset.app;
                this.launchApp(app);
                this.hideAllProgramsMenu();
                this.hideStartMenu();
            });
        });

        // Desktop icon clicks
        document.querySelectorAll('.desktop-icon').forEach(icon => {
            icon.addEventListener('click', (e) => {
                this.handleIconClick(e.currentTarget);
        });
    });

        // Right-click menu
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.showContextMenu(e.clientX, e.clientY);
        });

        // Hide right-click menu
        document.addEventListener('click', () => {
            this.hideContextMenu();
        });
    
    // Show desktop button
        document.getElementById('show-desktop').addEventListener('click', () => {
            this.showDesktop();
        });

        // Close start menu
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#start-menu') && !e.target.closest('#start-button')) {
                this.hideStartMenu();
        }
    });
}

    setupDesktopIcons() {
        // Desktop icons are now vertically arranged, no drag functionality needed
        // Only keep click events
    }

    setupWindowManagement() {
        // Window dragging
        document.addEventListener('mousedown', (e) => {
            const windowHeader = e.target.closest('.window-header');
            if (windowHeader) {
                const window = windowHeader.closest('.window');
                this.startWindowDragging(window, e);
            }
        });

        // Window control buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.window-control')) {
                const control = e.target.closest('.window-control');
                const window = control.closest('.window');
                const action = control.classList.contains('minimize') ? 'minimize' :
                             control.classList.contains('maximize') ? 'maximize' : 'close';
                this.windowAction(window, action);
            }
        });
    }

    positionDesktopIcons() {
        // Desktop icons now use flexbox layout, no manual positioning needed
        // Icons will automatically arrange vertically
    }

    handleIconClick(icon) {
        const iconId = icon.id;
        
        // Clear selection state of other icons
        document.querySelectorAll('.desktop-icon').forEach(i => i.classList.remove('selected'));
        icon.classList.add('selected');

        // Launch corresponding application based on icon ID
        switch (iconId) {
        case 'my-computer':
                this.launchApp('my-computer');
            break;
        case 'my-documents':
                this.launchApp('my-documents');
            break;
        case 'recycle-bin':
                this.launchApp('recycle-bin');
            break;
        case 'internet-explorer':
                this.launchApp('internet-explorer');
                break;
            case 'chat-room':
                this.launchApp('chat-room');
                break;
            case 'games':
                this.launchApp('games');
                break;
            case 'xp-tv':
                this.launchApp('xp-tv');
                break;
        }
    }

    launchApp(appName) {
        let windowConfig = {
            title: '',
            content: '',
            width: 400,
            height: 300
        };

        switch (appName) {
        case 'notepad':
            windowConfig = {
                title: 'Notepad',
                    content: this.createNotepadContent(),
                width: 500,
                    height: 400
            };
            break;
        case 'calculator':
            windowConfig = {
                title: 'Calculator',
                    content: this.createCalculatorContent(),
                width: 300,
                    height: 400
            };
            break;
        case 'paint':
            windowConfig = {
                title: 'Paint',
                    content: this.createPaintContent(),
                width: 600,
                    height: 500
            };
            break;
        case 'wordpad':
            windowConfig = {
                title: 'WordPad',
                    content: this.createWordpadContent(),
                    width: 500,
                    height: 400
                };
                break;
            case 'chat-room':
                windowConfig = {
                    title: 'Windows XP Chat Room',
                    content: this.createFullChatRoomContent(),
                    width: 800,
                    height: 600
                };
                break;
            case 'my-computer':
                windowConfig = {
                    title: 'System Performance Monitor',
                    content: this.createMyComputerContent(),
                    width: 700,
                    height: 500
                };
                break;
            case 'my-documents':
                windowConfig = {
                    title: 'My Documents',
                    content: this.createMyDocumentsContent(),
                    width: 600,
                    height: 400
                };
                break;
            case 'recycle-bin':
                windowConfig = {
                    title: 'BNBXP Donation Initiative',
                    content: this.createRecycleBinContent(),
                    width: 800,
                    height: 700
            };
            break;
            case 'internet-explorer':
            windowConfig = {
                    title: 'Internet Explorer',
                    content: this.createInternetExplorerContent(),
                    width: 1024,
                    height: 768
                };
                break;
            case 'games':
                windowConfig = {
                    title: 'Games',
                    content: this.createGamesContent(),
                    width: 400,
                    height: 300
                };
                break;
            case 'xp-tv':
                windowConfig = {
                    title: 'XP TV',
                    content: this.createXPTVContent(),
                    width: 1024,
                    height: 768
                };
                break;
        }

        this.createWindow(windowConfig);
    }

    createWindow(config) {
        this.windowCounter++;
        const windowId = `window-${this.windowCounter}`;
        
        const windowHTML = `
            <div class="window" id="${windowId}" style="width: ${config.width}px; height: ${config.height}px;">
                <div class="window-header">
            <div class="window-title">${config.title}</div>
            <div class="window-controls">
                        <div class="window-control minimize">_</div>
                        <div class="window-control maximize">□</div>
                        <div class="window-control close">×</div>
            </div>
        </div>
        <div class="window-content">
            ${config.content}
                </div>
        </div>
    `;
    
        const windowContainer = document.getElementById('window-container');
        windowContainer.insertAdjacentHTML('beforeend', windowHTML);

        const windowElement = document.getElementById(windowId);
        
        // Set window position (centered)
        windowElement.style.left = '50%';
        windowElement.style.top = '50%';
        windowElement.style.transform = 'translate(-50%, -50%)';

        // Add to window list
        this.windows.push({
        id: windowId,
        element: windowElement,
            title: config.title
        });

        // Activate window
        this.activateWindow(windowElement);

        // Add to taskbar
        this.addToTaskbar(windowId, config.title);

        // If it's Windows XP Chat Room, initialize full chat functionality
        if (config.title === 'Windows XP Chat Room') {
            windowElement.classList.add('chat-window');
            this.initFullChatRoom(windowElement);
        }
    }

    createNotepadContent() {
        return `
            <textarea style="width: 100%; height: 100%; border: none; resize: none; font-family: 'Consolas', monospace; font-size: 14px;" placeholder="Enter text here..."></textarea>
        `;
    }

    createCalculatorContent() {
        return `
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px; height: 100%;">
                <div style="grid-column: span 4; padding: 10px; border: 1px solid #ccc; background: white; text-align: right; font-size: 18px; margin-bottom: 10px;">0</div>
                <button class="calc-button">7</button>
                <button class="calc-button">8</button>
                <button class="calc-button">9</button>
                <button class="calc-button">÷</button>
                <button class="calc-button">4</button>
                <button class="calc-button">5</button>
                <button class="calc-button">6</button>
                <button class="calc-button">×</button>
                <button class="calc-button">1</button>
                <button class="calc-button">2</button>
                <button class="calc-button">3</button>
                <button class="calc-button">-</button>
                <button class="calc-button">0</button>
                <button class="calc-button">.</button>
                <button class="calc-button">=</button>
                <button class="calc-button">+</button>
                <button class="calc-button" style="grid-column: span 2;">C</button>
                <button class="calc-button">±</button>
                <button class="calc-button">%</button>
            </div>
        `;
    }

    createPaintContent() {
        return `
            <div style="text-align: center; padding: 50px;">
                            <h3>Paint Program</h3>
            <p>This is a simulated paint program</p>
            <p>Features under development...</p>
            </div>
        `;
    }

    createWordpadContent() {
        return `
            <div style="text-align: center; padding: 50px;">
                            <h3>WordPad</h3>
            <p>This is a simulated wordpad program</p>
            <p>Features under development...</p>
            </div>
        `;
    }



    createMyComputerContent() {
    return `
            <div style="padding: 20px; font-family: 'Tahoma', sans-serif;">
                <h3 style="color: #245edc; margin-bottom: 20px;">System Performance Monitor</h3>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <!-- CPU Usage -->
                    <div style="background: linear-gradient(135deg, #f8f8f8 0%, #e8e8e8 100%); border: 2px outset #c0c0c0; border-radius: 8px; padding: 15px;">
                        <div style="display: flex; align-items: center; margin-bottom: 10px;">
                            <i class="fas fa-microchip" style="font-size: 24px; color: #245edc; margin-right: 10px;"></i>
                            <h4 style="margin: 0; color: #245edc;">CPU Usage</h4>
                </div>
                        <div style="background: white; border: 2px inset #c0c0c0; border-radius: 4px; padding: 10px; margin-bottom: 10px;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                                <span>Current:</span>
                                <span id="cpu-usage" style="font-weight: bold; color: #245edc;">45%</span>
                </div>
                            <div style="background: #e0e0e0; height: 20px; border-radius: 3px; overflow: hidden;">
                                <div id="cpu-bar" style="background: linear-gradient(90deg, #245edc 0%, #4a6fd8 100%); height: 100%; width: 45%; transition: width 0.3s ease;"></div>
                </div>
                        </div>
                        <div style="font-size: 12px; color: #666;">
                            <div>Processor: Intel Core i7-9700K</div>
                            <div>Speed: 3.60 GHz</div>
                            <div>Cores: 8</div>
                        </div>
                    </div>
                    
                    <!-- Memory Usage -->
                    <div style="background: linear-gradient(135deg, #f8f8f8 0%, #e8e8e8 100%); border: 2px outset #c0c0c0; border-radius: 8px; padding: 15px;">
                        <div style="display: flex; align-items: center; margin-bottom: 10px;">
                            <i class="fas fa-memory" style="font-size: 24px; color: #245edc; margin-right: 10px;"></i>
                            <h4 style="margin: 0; color: #245edc;">Memory Usage</h4>
                        </div>
                        <div style="background: white; border: 2px inset #c0c0c0; border-radius: 4px; padding: 10px; margin-bottom: 10px;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                                <span>Current:</span>
                                <span id="memory-usage" style="font-weight: bold; color: #245edc;">62%</span>
                            </div>
                            <div style="background: #e0e0e0; height: 20px; border-radius: 3px; overflow: hidden;">
                                <div id="memory-bar" style="background: linear-gradient(90deg, #245edc 0%, #4a6fd8 100%); height: 100%; width: 62%; transition: width 0.3s ease;"></div>
                            </div>
                        </div>
                        <div style="font-size: 12px; color: #666;">
                            <div>Total: 16 GB DDR4</div>
                            <div>Used: 9.9 GB</div>
                            <div>Available: 6.1 GB</div>
                        </div>
                    </div>
                    
                    <!-- GPU Usage -->
                    <div style="background: linear-gradient(135deg, #f8f8f8 0%, #e8e8e8 100%); border: 2px outset #c0c0c0; border-radius: 8px; padding: 15px;">
                        <div style="display: flex; align-items: center; margin-bottom: 10px;">
                            <i class="fas fa-tv" style="font-size: 24px; color: #245edc; margin-right: 10px;"></i>
                            <h4 style="margin: 0; color: #245edc;">GPU Usage</h4>
                        </div>
                        <div style="background: white; border: 2px inset #c0c0c0; border-radius: 4px; padding: 10px; margin-bottom: 10px;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                                <span>Current:</span>
                                <span id="gpu-usage" style="font-weight: bold; color: #245edc;">28%</span>
                            </div>
                            <div style="background: #e0e0e0; height: 20px; border-radius: 3px; overflow: hidden;">
                                <div id="gpu-bar" style="background: linear-gradient(90deg, #245edc 0%, #4a6fd8 100%); height: 100%; width: 28%; transition: width 0.3s ease;"></div>
                            </div>
                        </div>
                        <div style="font-size: 12px; color: #666;">
                            <div>Graphics: NVIDIA RTX 3070</div>
                            <div>Memory: 8 GB GDDR6</div>
                            <div>Driver: 471.96</div>
                        </div>
                    </div>
                    
                    <!-- Network Usage -->
                    <div style="background: linear-gradient(135deg, #f8f8f8 0%, #e8e8e8 100%); border: 2px outset #c0c0c0; border-radius: 8px; padding: 15px;">
                        <div style="display: flex; align-items: center; margin-bottom: 10px;">
                            <i class="fas fa-network-wired" style="font-size: 24px; color: #245edc; margin-right: 10px;"></i>
                            <h4 style="margin: 0; color: #245edc;">Network Usage</h4>
                        </div>
                        <div style="background: white; border: 2px inset #c0c0c0; border-radius: 4px; padding: 10px; margin-bottom: 10px;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                                <span>Current:</span>
                                <span id="network-usage" style="font-weight: bold; color: #245edc;">15%</span>
                            </div>
                            <div style="background: #e0e0e0; height: 20px; border-radius: 3px; overflow: hidden;">
                                <div id="network-bar" style="background: linear-gradient(90deg, #245edc 0%, #4a6fd8 100%); height: 100%; width: 15%; transition: width 0.3s ease;"></div>
                            </div>
                        </div>
                        <div style="font-size: 12px; color: #666;">
                            <div>Download: 2.1 MB/s</div>
                            <div>Upload: 0.8 MB/s</div>
                            <div>Connection: 100 Mbps</div>
                        </div>
                    </div>
                </div>
                
                <div style="margin-top: 20px; text-align: center;">
                    <div style="display: flex; justify-content: center; gap: 10px; align-items: center;">
                        <button onclick="toggleAutoUpdate()" id="auto-update-btn" style="
                            padding: 8px 16px;
                            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
                            color: white;
                            border: 2px outset #c0c0c0;
                            border-radius: 4px;
                            cursor: pointer;
                            font-family: 'Tahoma', sans-serif;
                            font-size: 12px;
                        ">Auto Update: ON</button>
                        <button onclick="updateSystemStats()" style="
                            padding: 8px 16px;
                            background: linear-gradient(135deg, #245edc 0%, #4a6fd8 100%);
                            color: white;
                            border: 2px outset #c0c0c0;
                            border-radius: 4px;
                            cursor: pointer;
                            font-family: 'Tahoma', sans-serif;
                            font-size: 12px;
                        ">Manual Refresh</button>
                    </div>
                    <div style="margin-top: 10px; font-size: 11px; color: #666;">
                        Auto update every 2 seconds
                </div>
            </div>
        </div>
    `;
}

    createMyDocumentsContent() {
    return `
            <div style="padding: 20px; font-family: 'Tahoma', sans-serif;">
                <h3 style="color: #245edc; margin-bottom: 20px;">My Documents</h3>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 20px; margin-top: 20px;">
                    <!-- Change Wallpaper -->
                    <div style="text-align: center; cursor: pointer; padding: 15px; background: linear-gradient(135deg, #f8f8f8 0%, #e8e8e8 100%); border: 2px outset #c0c0c0; border-radius: 8px; transition: all 0.2s ease;" onclick="windowsXP.changeWallpaper()">
                        <i class="fas fa-image" style="font-size: 32px; color: #245edc; margin-bottom: 10px;"></i>
                        <div style="font-weight: bold; color: #245edc;">Change Wallpaper</div>
                        <div style="font-size: 11px; color: #666; margin-top: 5px;">Customize desktop background</div>
                    </div>
                    
                    <!-- System Settings -->
                    <div style="text-align: center; cursor: pointer; padding: 15px; background: linear-gradient(135deg, #f8f8f8 0%, #e8e8e8 100%); border: 2px outset #c0c0c0; border-radius: 8px; transition: all 0.2s ease;" onclick="windowsXP.openSystemSettings()">
                        <i class="fas fa-cog" style="font-size: 32px; color: #245edc; margin-bottom: 10px;"></i>
                        <div style="font-weight: bold; color: #245edc;">System Settings</div>
                        <div style="font-size: 11px; color: #666; margin-top: 5px;">Configure system preferences</div>
                    </div>
                    
                    <!-- User Profile -->
                    <div style="text-align: center; cursor: pointer; padding: 15px; background: linear-gradient(135deg, #f8f8f8 0%, #e8e8e8 100%); border: 2px outset #c0c0c0; border-radius: 8px; transition: all 0.2s ease;" onclick="windowsXP.openUserProfile()">
                        <i class="fas fa-user" style="font-size: 32px; color: #245edc; margin-bottom: 10px;"></i>
                        <div style="font-weight: bold; color: #245edc;">User Profile</div>
                        <div style="font-size: 11px; color: #666; margin-top: 5px;">Manage user account</div>
                    </div>
                    
                    <!-- Network Settings -->
                    <div style="text-align: center; cursor: pointer; padding: 15px; background: linear-gradient(135deg, #f8f8f8 0%, #e8e8e8 100%); border: 2px outset #c0c0c0; border-radius: 8px; transition: all 0.2s ease;" onclick="windowsXP.openNetworkSettings()">
                        <i class="fas fa-network-wired" style="font-size: 32px; color: #245edc; margin-bottom: 10px;"></i>
                        <div style="font-weight: bold; color: #245edc;">Network Settings</div>
                        <div style="font-size: 11px; color: #666; margin-top: 5px;">Configure network connection</div>
                    </div>
                </div>
                
                <div style="margin-top: 30px; padding: 15px; background: linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%); border: 2px outset #c0c0c0; border-radius: 8px;">
                    <h4 style="color: #245edc; margin-bottom: 10px;">Recent Documents</h4>
                    <div style="font-size: 12px; color: #666;">
                        <div style="padding: 5px 0; border-bottom: 1px solid #e0e0e0;">📄 system_config.txt - Modified 2 hours ago</div>
                        <div style="padding: 5px 0; border-bottom: 1px solid #e0e0e0;">📄 user_preferences.ini - Modified 1 day ago</div>
                        <div style="padding: 5px 0; border-bottom: 1px solid #e0e0e0;">📄 network_settings.cfg - Modified 3 days ago</div>
                        <div style="padding: 5px 0;">📄 wallpaper_backup.dat - Modified 1 week ago</div>
                    </div>
            </div>
        </div>
    `;
}

    createRecycleBinContent() {
    return `
            <div style="padding: 20px; font-family: 'Tahoma', sans-serif; line-height: 1.6; max-height: 100%; overflow-y: auto;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <h2 style="color: #245edc; font-size: 18px; margin-bottom: 10px;">On the On-Chain Co-construction Initiative in Support of BNBXP</h2>
                    <div style="width: 100px; height: 2px; background: linear-gradient(90deg, transparent 0%, #245edc 50%, transparent 100%); margin: 0 auto;"></div>
                </div>
                
                <div style="background: linear-gradient(135deg, #f8f8f8 0%, #e8e8e8 100%); border: 2px outset #c0c0c0; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                    <p style="margin-bottom: 15px; font-weight: bold; color: #245edc;">Dear Node Partners,</p>
                    
                    <p style="margin-bottom: 15px; text-align: justify;">
                        Since BNBXP joined the network as a decentralized information node, we have been dedicated to building a consensus-driven, value-sharing ecosystem — where every click counts as an on-chain interaction, and every piece of content stands as verified block information. We hold a firm belief that a truly viable network should be co-maintained and co-benefited by all participants.
                    </p>
                    
                    <p style="margin-bottom: 15px; text-align: justify;">
                        These growth metrics have been permanently recorded on the chain for authentication, with every interaction traceable via hash values — all made possible through the collective efforts of distributed nodes.
                    </p>
                    
                    <p style="margin-bottom: 15px; text-align: justify;">
                        The network now faces a need for computing power expansion: server node maintenance demands continuous computing support; smart contract development (including new feature iterations) requires investment in technical resources; and content block verification (such as high-quality content review) calls for the establishment of relevant mechanisms. To ensure stable network operation and facilitate the next phase of upgrades, we are launching an on-chain donation initiative.
                    </p>
                    
                    <p style="margin-bottom: 15px; text-align: justify;">
                        Each donation you make will generate a unique transaction hash, permanently inscribed in the donation blockchain — an indelible mark in BNBXP's ecosystem development.
                    </p>
                </div>
                
                <div style="background: linear-gradient(135deg, #e8f4fd 0%, #d1e7fd 100%); border: 2px outset #c0c0c0; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                    <h3 style="color: #245edc; font-size: 16px; margin-bottom: 15px;">On-chain donation channels:</h3>
                    <p style="margin-bottom: 10px; font-weight: bold;">Cryptocurrency channel:</p>
                    <p style="margin-bottom: 15px;">Supports transfers of any assets on the BNB Smart Chain (BEP20)</p>
                    
                    <div style="background: white; border: 2px inset #c0c0c0; border-radius: 4px; padding: 12px; margin-bottom: 15px; font-family: 'Consolas', monospace; font-size: 12px; word-break: break-all;">
                        <strong>Wallet address (BSC):</strong><br>
                        0xd6e9f99aab16c50d5b34d72aeeb26e7c8cc3a09c
                    </div>
                    
                    <p style="font-size: 12px; color: #666; font-style: italic;">
                        Once each donation is completed, records can be queried via blockchain explorers, enabling truly decentralized and transparent oversight. This ensures every bit of your support is clearly traceable.
                    </p>
                </div>
                
                <div style="background: linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%); border: 2px outset #c0c0c0; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                    <p style="margin-bottom: 15px; text-align: justify;">
                        In this distributed network, there is no monologue from a central node — only a chorus of consensus from all participants. Every contribution of computing power you provide serves as the strongest consensus endorsement for this ecosystem. Let us continue to leverage the power of decentralization to jointly nurture this digital home that belongs to us all.
                    </p>
                    
                    <div style="text-align: center; margin-top: 20px;">
                        <p style="font-weight: bold; color: #245edc; font-size: 14px;">BNBXP Node Maintenance Team</p>
                    </div>
            </div>
        </div>
    `;
}

    createInternetExplorerContent() {
    return `
            <div style="width: 100%; height: 100%; padding: 0; margin: 0; position: relative;">
                <!-- Loading Animation -->
                <div id="ie-loading" style="
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    z-index: 10;
                    font-family: 'Tahoma', sans-serif;
                ">
                    <div style="
                        width: 60px;
                        height: 60px;
                        border: 4px solid #e0e0e0;
                        border-top: 4px solid #245edc;
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                        margin-bottom: 20px;
                    "></div>
                    <div style="
                        color: #245edc;
                        font-size: 14px;
                        font-weight: bold;
                        text-align: center;
                    ">
                        <div>Loading...</div>
                        <div style="font-size: 12px; color: #666; margin-top: 5px;">Please wait while the page loads</div>
            </div>
                </div>
                
                <!-- Website iframe -->
                <iframe id="ie-iframe" 
                        src="https://letsbonk.fun/" 
                        style="width: 100%; height: 100%; border: none; background: white; opacity: 0; transition: opacity 0.5s ease;"
                        allowfullscreen
                        onload="document.getElementById('ie-loading').style.display='none'; document.getElementById('ie-iframe').style.opacity='1';">
                </iframe>
        </div>
    `;
}

    createXPTVContent() {
        return `
            <div style="width: 100%; height: 100%; padding: 0; margin: 0; position: relative;">
                <!-- Loading Animation -->
                <div id="xptv-loading" style="
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    z-index: 10;
                    font-family: 'Tahoma', sans-serif;
                ">
                    <div style="
                        width: 60px;
                        height: 60px;
                        border: 4px solid #e0e0e0;
                        border-top: 4px solid #245edc;
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                        margin-bottom: 20px;
                    "></div>
                    <div style="
                        color: #245edc;
                        font-size: 14px;
                        font-weight: bold;
                        text-align: center;
                    ">
                        <div>Loading XP TV...</div>
                        <div style="font-size: 12px; color: #666; margin-top: 5px;">Connecting to BNBTV</div>
                    </div>
                </div>
                
                <!-- Website iframe -->
                <iframe id="xptv-iframe" 
                        src="https://bonktv.net/" 
                        style="width: 100%; height: 100%; border: none; background: white; opacity: 0; transition: opacity 0.5s ease;"
                        allowfullscreen
                        onload="document.getElementById('xptv-loading').style.display='none'; document.getElementById('xptv-iframe').style.opacity='1';">
                </iframe>
                
                <!-- Click Restriction Overlay - Blocks the top navigation bar area -->
                <div id="xptv-overlay" style="
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 80px;
                    background: transparent;
                    z-index: 5;
                    pointer-events: auto;
                    cursor: not-allowed;
                " title="Navigation area is disabled"></div>
            </div>
        `;
    }

        createFullChatRoomContent() {
    return `
            <style>
                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.8; transform: scale(1.05); }
                }
            </style>
            <div style="width: 100%; height: 100%; display: flex; flex-direction: column; background: linear-gradient(135deg, #e6e6e6 0%, #c0c0c0 100%); font-family: 'Tahoma', sans-serif; overflow: hidden;">
                <!-- Login/Register Area -->
                <div id="authArea" style="flex: 1; display: flex; justify-content: center; align-items: center; padding: 20px; background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%);">
                    <div style="background: linear-gradient(135deg, #f8f8f8 0%, #e8e8e8 100%); border: 3px outset #c0c0c0; border-radius: 8px; padding: 30px; width: 400px; box-shadow: 0 4px 12px rgba(0,0,0,0.2);">
                        <!-- Top decoration bar -->
                        <div style="background: linear-gradient(90deg, #000080 0%, #4169e1 50%, #000080 100%); height: 25px; margin: -30px -30px 20px -30px; border-radius: 5px 5px 0 0; display: flex; align-items: center; padding: 0 15px;">
                            <div style="color: white; font-weight: bold; font-size: 14px;">
                                <i class="fas fa-comments" style="margin-right: 8px;"></i>Windows XP Chat Room
                            </div>
                        </div>
                        
                        <div style="text-align: center; margin-bottom: 25px;">
                            <div style="display: inline-block; background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%); border: 2px outset #c0c0c0; border-radius: 8px; padding: 15px; margin-bottom: 15px;">
                                <img src="png/1.png" alt="Chat Room Icon" style="width: 64px; height: 64px; border: 1px solid #808080; border-radius: 4px; padding: 3px; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                            </div>
                            <h3 style="margin: 10px 0; color: #000080; font-size: 18px; text-shadow: 1px 1px 2px rgba(0,0,0,0.1);">Welcome to Chat Room</h3>
                            <p style="font-size: 12px; color: #666666; margin: 5px 0;">Username will be displayed in the chat room</p>
                            <div style="width: 60px; height: 2px; background: linear-gradient(90deg, transparent 0%, #000080 50%, transparent 100%); margin: 10px auto;"></div>
                        </div>
                        
                        <!-- Login Form -->
                        <div id="loginForm">
                            <div style="margin-bottom: 18px;">
                                <label style="display: block; font-size: 12px; margin-bottom: 6px; color: #000080; font-weight: bold;">
                                    <i class="fas fa-user" style="margin-right: 5px;"></i>Username:
                                </label>
                                <input type="text" id="loginUsername" style="width: 100%; padding: 8px; border: 2px inset #c0c0c0; border-radius: 4px; font-size: 12px; background: white; box-sizing: border-box;" placeholder="Enter username">
                            </div>
                            
                            <div style="margin-bottom: 25px;">
                                <label style="display: block; font-size: 12px; margin-bottom: 6px; color: #000080; font-weight: bold;">
                                    <i class="fas fa-lock" style="margin-right: 5px;"></i>Password:
                                </label>
                                <input type="password" id="loginPassword" style="width: 100%; padding: 8px; border: 2px inset #c0c0c0; border-radius: 4px; font-size: 12px; background: white; box-sizing: border-box;" placeholder="Enter password">
                            </div>
                            
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <button id="showRegisterBtn" style="padding: 8px 16px; background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%); border: 2px outset #c0c0c0; border-radius: 4px; cursor: pointer; font-size: 11px; font-weight: bold; color: #000080; transition: all 0.2s;">
                                    <i class="fas fa-user-plus" style="margin-right: 5px;"></i>Register New User
                                </button>
                                <button id="loginButton" style="padding: 10px 20px; background: linear-gradient(135deg, #000080 0%, #4169e1 100%); border: 2px outset #c0c0c0; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: bold; color: white; transition: all 0.2s;">
                                    <i class="fas fa-sign-in-alt" style="margin-right: 5px;"></i>Login
                                </button>
                            </div>
                        </div>
                        
                        <!-- Registration Form -->
                        <div id="registerForm" style="display: none;">
                            <div style="margin-bottom: 18px;">
                                <label style="display: block; font-size: 12px; margin-bottom: 6px; color: #000080; font-weight: bold;">
                                    <i class="fas fa-user" style="margin-right: 5px;"></i>Username:
                                </label>
                                <input type="text" id="registerUsername" style="width: 100%; padding: 8px; border: 2px inset #c0c0c0; border-radius: 4px; font-size: 12px; background: white; box-sizing: border-box;" placeholder="Enter username">
                            </div>
                            
                            <div style="margin-bottom: 18px;">
                                <label style="display: block; font-size: 12px; margin-bottom: 6px; color: #000080; font-weight: bold;">
                                    <i class="fas fa-lock" style="margin-right: 5px;"></i>Password:
                                </label>
                                <input type="password" id="registerPassword" style="width: 100%; padding: 8px; border: 2px inset #c0c0c0; border-radius: 4px; font-size: 12px; background: white; box-sizing: border-box;" placeholder="Enter password">
                            </div>
                            
                            <div style="margin-bottom: 18px;">
                                <label style="display: block; font-size: 12px; margin-bottom: 6px; color: #000080; font-weight: bold;">
                                    <i class="fas fa-check-circle" style="margin-right: 5px;"></i>Confirm Password:
                                </label>
                                <input type="password" id="confirmPassword" style="width: 100%; padding: 8px; border: 2px inset #c0c0c0; border-radius: 4px; font-size: 12px; background: white; box-sizing: border-box;" placeholder="Enter password again">
                            </div>
                            

                            
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <button id="showLoginBtn" style="padding: 8px 16px; background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%); border: 2px outset #c0c0c0; border-radius: 4px; cursor: pointer; font-size: 11px; font-weight: bold; color: #000080; transition: all 0.2s;">
                                    <i class="fas fa-arrow-left" style="margin-right: 5px;"></i>Back to Login
                                </button>
                                <button id="registerButton" style="padding: 10px 20px; background: linear-gradient(135deg, #008000 0%, #32cd32 100%); border: 2px outset #c0c0c0; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: bold; color: white; transition: all 0.2s;">
                                    <i class="fas fa-user-plus" style="margin-right: 5px;"></i>Register
                                </button>
                            </div>
                        </div>
                        
                        <!-- Message Display Area -->
                        <div id="authMessage" style="margin-top: 15px; padding: 8px; font-size: 11px; text-align: center; min-height: 20px; border-radius: 4px; background: rgba(255,255,255,0.7);"></div>
                    </div>
                </div>
                
                <!-- Chat Area (Hidden by default) -->
                <div id="chatArea" style="flex: 1; display: none; flex-direction: column; background: linear-gradient(135deg, #f8f8f8 0%, #e8e8e8 100%); min-height: 0;">
                    <div style="display: flex; height: 100%; min-height: 0;">
                        <!-- Left User List -->
                        <div style="width: 220px; border-right: 3px solid #808080; display: flex; flex-direction: column; background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%); height: 100%; min-height: 0;">
                            <div style="background: linear-gradient(90deg, #000080 0%, #4169e1 50%, #000080 100%); color: white; padding: 8px; font-size: 12px; font-weight: bold; border-bottom: 2px solid #808080; flex-shrink: 0;">
                                <i class="fas fa-users" style="margin-right: 8px;"></i>Online Users
                            </div>
                            <div id="userList" style="flex: 1; background: white; padding: 8px; overflow-y: auto; overflow-x: hidden; font-size: 12px; border-radius: 0 0 4px 0; scroll-behavior: smooth; scrollbar-width: thin; scrollbar-color: #c0c0c0 #f0f0f0; min-height: 0;" class="custom-scrollbar">
                                <div style="color: #808080; font-style: italic; text-align: center; padding: 20px;">
                                    <i class="fas fa-spinner fa-spin" style="margin-right: 5px;"></i>Waiting for connection...
                                </div>
                            </div>
        </div>
                        
                        <!-- Right Chat Area -->
                        <div style="flex: 1; display: flex; flex-direction: column; height: 100%; min-height: 0;">
                            <!-- Chat Message Area -->
                            <div id="messageArea" style="flex: 1; background: linear-gradient(135deg, #ffffff 0%, #f8f8f8 100%); padding: 15px; overflow-y: auto; overflow-x: hidden; font-size: 12px; border-radius: 0 0 0 4px; scroll-behavior: smooth; scrollbar-width: thin; scrollbar-color: #c0c0c0 #f0f0f0; min-height: 0;" class="custom-scrollbar">
                                <div style="text-align: center; color: #666666; margin-bottom: 15px; padding: 20px;">
                                    <i class="fas fa-comments" style="font-size: 24px; color: #000080; margin-bottom: 10px; display: block;"></i>
                                    <div style="font-size: 16px; font-weight: bold; color: #000080; margin-bottom: 5px;">Welcome to Windows XP Chat Room</div>
                                    <div style="font-size: 12px;">Please login to start chatting</div>
                                </div>
                            </div>
                            
                            <!-- Input Area - Fixed Height -->
                            <div class="input-area" style="background: linear-gradient(135deg, #e8e8e8 0%, #d8d8d8 100%); padding: 15px; border-top: 3px solid #808080; border-radius: 0 0 4px 4px; flex-shrink: 0; overflow: hidden;">
                                <textarea id="messageInput" style="width: 100%; height: 70px; border: 2px inset #c0c0c0; border-radius: 4px; padding: 8px; font-size: 12px; resize: none; background: white; box-sizing: border-box;" placeholder="Enter message..."></textarea>
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
                                    <div style="font-size: 11px; color: #666666;">
                                        <span id="connectionStatus" style="color: #ff4444; font-weight: bold;">
                                            <i class="fas fa-circle" style="margin-right: 5px;"></i>Disconnected
                                        </span>
                                    </div>
                                    <div style="display: flex; gap: 8px;">
                                        <button id="clearChatBtn" style="padding: 6px 12px; background: linear-gradient(135deg, #c84a4a 0%, #a03030 100%); border: 2px outset #c0c0c0; border-radius: 4px; cursor: pointer; font-size: 11px; font-weight: bold; color: white; transition: all 0.2s; display: none;" title="Clear all chat messages" disabled>
                                            <i class="fas fa-trash" style="margin-right: 3px;"></i>Clear
                                        </button>
                                        <button id="scrollToBottomBtn" style="padding: 6px 12px; background: linear-gradient(135deg, #1084d0 0%, #000080 100%); border: 2px outset #4a6fd8; border-radius: 4px; cursor: pointer; font-size: 11px; font-weight: bold; color: white; transition: all 0.2s; display: none; box-shadow: 0 2px 8px rgba(0,0,128,0.3); animation: pulse 2s infinite;" title="Scroll to latest message">
                                            <i class="fas fa-arrow-down" style="margin-right: 3px;"></i>New Messages ↓
                                        </button>
                                        <button id="sendButton" style="padding: 8px 16px; background: linear-gradient(135deg, #000080 0%, #4169e1 100%); border: 2px outset #c0c0c0; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: bold; color: white; transition: all 0.2s;" disabled>
                                            <i class="fas fa-paper-plane" style="margin-right: 5px;"></i>Send
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
        </div>
    `;
} 

    initFullChatRoom(windowElement) {
        console.log('initFullChatRoom called');
        console.log('windowElement:', windowElement);
        
        // Get DOM elements
        const loginButton = windowElement.querySelector('#loginButton');
        const registerButton = windowElement.querySelector('#registerButton');
        const showRegisterBtn = windowElement.querySelector('#showRegisterBtn');
        const showLoginBtn = windowElement.querySelector('#showLoginBtn');
        const loginForm = windowElement.querySelector('#loginForm');
        const registerForm = windowElement.querySelector('#registerForm');
        const authArea = windowElement.querySelector('#authArea');
        const chatArea = windowElement.querySelector('#chatArea');
        const messageArea = windowElement.querySelector('#messageArea');
        const messageInput = windowElement.querySelector('#messageInput');
        const sendButton = windowElement.querySelector('#sendButton');
        const clearChatBtn = windowElement.querySelector('#clearChatBtn');
        const scrollToBottomBtn = windowElement.querySelector('#scrollToBottomBtn');
        const userList = windowElement.querySelector('#userList');
        const connectionStatus = windowElement.querySelector('#connectionStatus');
        const authMessage = windowElement.querySelector('#authMessage');

        // 添加滚动监听器
        if (messageArea) {
            messageArea.addEventListener('scroll', () => {
                const { scrollTop, scrollHeight, clientHeight } = messageArea;
                isScrolledToBottom = scrollTop + clientHeight >= scrollHeight - 10; // 10px的容差
                
                // 显示/隐藏滚动到底部按钮
                if (scrollToBottomBtn) {
                    if (isScrolledToBottom) {
                        scrollToBottomBtn.style.display = 'none';
                    } else {
                        scrollToBottomBtn.style.display = 'inline-block';
                    }
                }
            });
        }
        
        // 滚动到底部按钮事件
        if (scrollToBottomBtn) {
            scrollToBottomBtn.addEventListener('click', () => {
                if (messageArea) {
                    messageArea.scrollTop = messageArea.scrollHeight;
                    isScrolledToBottom = true;
                    scrollToBottomBtn.style.display = 'none';
                }
            });
        }
        
        // 阻止输入区域的滚动事件
        const inputArea = windowElement.querySelector('.input-area');
        if (inputArea) {
            inputArea.addEventListener('wheel', (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
        }
        
        // 阻止输入框的滚动事件
        if (messageInput) {
            messageInput.addEventListener('wheel', (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
        }
        
        // 确保布局在窗口大小改变时正确
        const ensureLayout = () => {
            const chatArea = windowElement.querySelector('#chatArea');
            if (chatArea && chatArea.style.display !== 'none') {
                // 强制重新计算布局
                chatArea.style.height = '100%';
                const messageArea = chatArea.querySelector('#messageArea');
                if (messageArea) {
                    messageArea.style.height = '100%';
                    messageArea.style.minHeight = '0';
                }
            }
        };
        
        // 监听窗口大小改变
        window.addEventListener('resize', ensureLayout);
        
        // 初始确保布局
        setTimeout(ensureLayout, 100);
        
        console.log('DOM元素获取结果:');
        console.log('loginButton:', loginButton);
        console.log('registerButton:', registerButton);
        console.log('showRegisterBtn:', showRegisterBtn);
        console.log('showLoginBtn:', showLoginBtn);
        console.log('loginForm:', loginForm);
        console.log('registerForm:', registerForm);
        console.log('authArea:', authArea);
        console.log('chatArea:', chatArea);
        console.log('authMessage:', authMessage);
        
        let username = '';
        let socket = null;
        let isScrolledToBottom = true; // 跟踪是否滚动到底部
        
        // 显示注册表单
        showRegisterBtn.addEventListener('click', () => {
            loginForm.style.display = 'none';
            registerForm.style.display = 'block';
            authMessage.textContent = '';
        });
        
        // 显示登录表单
        showLoginBtn.addEventListener('click', () => {
            registerForm.style.display = 'none';
            loginForm.style.display = 'block';
            authMessage.textContent = '';
        });
        

        
        // 注册处理
        registerButton.addEventListener('click', async () => {
            const registerUsername = windowElement.querySelector('#registerUsername').value.trim();
            const registerPassword = windowElement.querySelector('#registerPassword').value;
            const confirmPassword = windowElement.querySelector('#confirmPassword').value;
            
            console.log('注册按钮被点击');
            console.log('用户名:', registerUsername);
            console.log('密码:', registerPassword);
            console.log('确认密码:', confirmPassword);
            
            if (!registerUsername || !registerPassword || !confirmPassword) {
                showMessage('请填写所有必填字段', 'error');
                return;
            }
            
            if (registerPassword !== confirmPassword) {
                showMessage('密码和确认密码不匹配', 'error');
                return;
            }
            
            // 显示注册加载动画
            const originalText = registerButton.innerHTML;
            registerButton.disabled = true;
            registerButton.innerHTML = '<i class="fas fa-spinner fa-spin" style="margin-right: 5px;"></i>Registering...';
            
            try {
                const response = await apiRequest('register', {
                    username: registerUsername,
                    password: registerPassword,
                    confirmPassword: confirmPassword
                });
                
                console.log('注册响应:', response);
                
                if (response.success) {
                    // 显示 XP 风格成功对话框
                    const successDialog = document.createElement('div');
                    successDialog.style.cssText = `
                        position: fixed;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        background: linear-gradient(135deg, #e8f4fd 0%, #d1e7fd 100%);
                        border: 2px outset #c0c0c0;
                        border-radius: 8px;
                        padding: 30px;
                        box-shadow: 0 4px 16px rgba(0,0,0,0.3);
                        z-index: 10000;
                        min-width: 400px;
                        text-align: center;
                        font-family: 'Tahoma', sans-serif;
                        animation: successPop 0.3s ease-out;
                    `;
                    
                    successDialog.innerHTML = `
                        <div style="margin-bottom: 20px;">
                            <div style="font-size: 64px; color: #008000; animation: successIcon 0.5s ease-out;">✓</div>
                        </div>
                        <div style="font-size: 18px; font-weight: bold; color: #000080; margin-bottom: 10px;">
                            🎉 Registration Successful!
                        </div>
                        <div style="font-size: 13px; color: #333; margin-bottom: 20px;">
                            User <strong>${registerUsername}</strong> has been successfully registered!<br>
                            Redirecting to login page...
                        </div>
                        <div style="width: 100%; height: 4px; background: #e0e0e0; border-radius: 2px; overflow: hidden; margin-bottom: 15px;">
                            <div style="width: 0%; height: 100%; background: linear-gradient(90deg, #008000, #00c000); animation: progressBar 2s ease-out forwards;"></div>
                        </div>
                        <button onclick="this.parentElement.remove()" style="
                            background: linear-gradient(135deg, #f8f8f8 0%, #e8e8e8 100%);
                            border: 2px outset #c0c0c0;
                            padding: 6px 20px;
                            border-radius: 4px;
                            cursor: pointer;
                            font-size: 12px;
                            font-weight: bold;
                        ">OK</button>
                    `;
                    
                    // 添加动画样式
                    if (!document.querySelector('#successAnimations')) {
                        const style = document.createElement('style');
                        style.id = 'successAnimations';
                        style.textContent = `
                            @keyframes successPop {
                                0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
                                100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                            }
                            @keyframes successIcon {
                                0% { transform: scale(0) rotate(-180deg); opacity: 0; }
                                50% { transform: scale(1.2) rotate(10deg); }
                                100% { transform: scale(1) rotate(0deg); opacity: 1; }
                            }
                            @keyframes progressBar {
                                0% { width: 0%; }
                                100% { width: 100%; }
                            }
                        `;
                        document.head.appendChild(style);
                    }
                    
                    document.body.appendChild(successDialog);
                    
                    // 2秒后自动关闭并切换到登录表单
                    setTimeout(() => {
                        successDialog.remove();
                        registerForm.style.display = 'none';
                        loginForm.style.display = 'block';
                        // 自动填充用户名
                        const loginUsernameInput = windowElement.querySelector('#loginUsername');
                        if (loginUsernameInput) {
                            loginUsernameInput.value = registerUsername;
                        }
                        showMessage('🎉 Registration successful! Please enter your password to login', 'success');
                    }, 2000);
                } else {
                    showMessage(response.message, 'error');
                }
            } catch (error) {
                console.error('注册失败:', error);
                                        showMessage('Registration failed, please try again', 'error');
            } finally {
                // 恢复按钮状态
                registerButton.disabled = false;
                registerButton.innerHTML = originalText;
            }
        });
        
        // 登录处理
        loginButton.addEventListener('click', async () => {
            const loginUsername = windowElement.querySelector('#loginUsername').value.trim();
            const loginPassword = windowElement.querySelector('#loginPassword').value;
            
            console.log('登录按钮被点击');
            console.log('用户名:', loginUsername);
            console.log('密码:', loginPassword);
            
            if (!loginUsername || !loginPassword) {
                showMessage('请输入用户名和密码', 'error');
                return;
            }
            
            // 显示登录加载动画
            const originalText = loginButton.innerHTML;
            loginButton.disabled = true;
            loginButton.innerHTML = '<i class="fas fa-spinner fa-spin" style="margin-right: 5px;"></i>Logging in...';
            
            try {
                const response = await apiRequest('login', {
                    username: loginUsername,
                    password: loginPassword
                });
                
                console.log('登录响应:', response);
                
                if (response.success) {
                    showMessage(response.message, 'success');
                    username = response.username;
                    
                    // 登录成功后进入聊天室
                    setTimeout(() => {
                        authArea.style.display = 'none';
                        chatArea.style.display = 'flex';
                        
                        // 确保布局正确
                        chatArea.style.height = '100%';
                        const messageArea = chatArea.querySelector('#messageArea');
                        if (messageArea) {
                            messageArea.style.height = '100%';
                            messageArea.style.minHeight = '0';
                        }
                        
                        // 启动Firebase实时监听
                        startFirebaseListeners();
                        
                        // 添加欢迎消息
                        setTimeout(() => {
                            addMessage('System', `Welcome ${username} to the chat room!`, false, true);
                        }, 2000);
                    }, 1500); // 增加延迟确保Firebase初始化完成
                } else {
                    showMessage(response.message, 'error');
                }
            } catch (error) {
                console.error('登录失败:', error);
                                        showMessage('Login failed, please try again', 'error');
            } finally {
                // 恢复按钮状态
                loginButton.disabled = false;
                loginButton.innerHTML = originalText;
            }
        });
        
        // 显示消息
        function showMessage(message, type = 'info') {
            authMessage.innerHTML = message.replace(/\n/g, '<br>');
            
            // 根据消息类型设置样式
            if (type === 'error') {
                authMessage.style.color = '#ff0000';
                authMessage.style.fontWeight = 'bold';
                authMessage.style.background = 'rgba(255, 0, 0, 0.1)';
            } else if (type === 'success') {
                authMessage.style.color = '#008000';
                authMessage.style.fontWeight = 'bold';
                authMessage.style.background = 'rgba(0, 128, 0, 0.1)';
            } else {
                authMessage.style.color = '#000080';
                authMessage.style.fontWeight = 'normal';
                authMessage.style.background = 'rgba(255, 255, 255, 0.7)';
            }
            
            authMessage.style.fontSize = '11px';
            authMessage.style.lineHeight = '1.4';
            authMessage.style.textAlign = 'left';
            authMessage.style.padding = '8px';
            authMessage.style.borderRadius = '4px';
            authMessage.style.border = '1px solid rgba(0,0,0,0.1)';
        }
        
        // 发送消息
        sendButton.addEventListener('click', sendMessage);
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
        
        // 清空聊天记录
        if (clearChatBtn) {
            clearChatBtn.addEventListener('click', clearAllMessages);
        }
        
        // 发送消息函数
        async function sendMessage() {
            const message = messageInput.value.trim();
            if (!message || !username) return;
            
            // 禁用发送按钮，防止重复发送
            const originalText = sendButton.innerHTML;
            sendButton.disabled = true;
            sendButton.innerHTML = '<i class="fas fa-spinner fa-spin" style="margin-right: 5px;"></i>发送中...';
            
            try {
                const response = await apiRequest('sendMessage', {
                    username: username,
                    text: message
                });
                
                if (response.success) {
                    // 不在这里显示消息，让Firebase监听器统一处理
                    // addMessage(username, message, true);
                    
                    // 清空输入框
                    messageInput.value = '';
                } else {
                    console.error('发送失败:', response.message);
                    // 在聊天区域显示错误消息
                    addMessage('系统', '发送失败，请重试', false, true);
                }
            } catch (error) {
                console.error('发送消息失败:', error);
                // 在聊天区域显示错误消息
                addMessage('系统', '发送失败，请重试', false, true);
            } finally {
                // 恢复发送按钮
                sendButton.disabled = false;
                sendButton.innerHTML = originalText;
            }
        }
        
        // 清空所有聊天消息
        async function clearAllMessages() {
            // 显示确认对话框
            const confirmDialog = document.createElement('div');
            confirmDialog.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, #f8f8f8 0%, #e8e8e8 100%);
                border: 3px outset #c0c0c0;
                border-radius: 8px;
                padding: 25px;
                box-shadow: 0 4px 16px rgba(0,0,0,0.3);
                z-index: 10000;
                min-width: 400px;
                text-align: center;
                font-family: 'Tahoma', sans-serif;
            `;
            
            confirmDialog.innerHTML = `
                <div style="margin-bottom: 20px;">
                    <div style="font-size: 48px; color: #ff6b6b;">⚠️</div>
                </div>
                <div style="font-size: 16px; font-weight: bold; color: #000080; margin-bottom: 10px;">
                    Clear All Chat Messages?
                </div>
                <div style="font-size: 12px; color: #666; margin-bottom: 25px;">
                    This will permanently delete all chat messages.<br>This action cannot be undone!
                </div>
                <div style="display: flex; gap: 10px; justify-content: center;">
                    <button id="confirmClear" style="
                        background: linear-gradient(135deg, #c84a4a 0%, #a03030 100%);
                        border: 2px outset #c0c0c0;
                        padding: 8px 20px;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 12px;
                        font-weight: bold;
                        color: white;
                    ">Clear All</button>
                    <button id="cancelClear" style="
                        background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%);
                        border: 2px outset #c0c0c0;
                        padding: 8px 20px;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 12px;
                        font-weight: bold;
                        color: #000;
                    ">Cancel</button>
                </div>
            `;
            
            document.body.appendChild(confirmDialog);
            
            // 取消按钮
            confirmDialog.querySelector('#cancelClear').addEventListener('click', () => {
                confirmDialog.remove();
            });
            
            // 确认按钮
            confirmDialog.querySelector('#confirmClear').addEventListener('click', async () => {
                const confirmBtn = confirmDialog.querySelector('#confirmClear');
                const originalText = confirmBtn.innerHTML;
                confirmBtn.disabled = true;
                confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Clearing...';
                
                try {
                    // 确保Firebase已初始化
                    if (!window.db) {
                        throw new Error('Firebase not initialized');
                    }
                    
                    // 删除所有消息
                    const messagesRef = window.db.collection('messages');
                    const snapshot = await messagesRef.get();
                    
                    const batch = window.db.batch();
                    snapshot.docs.forEach(doc => {
                        batch.delete(doc.ref);
                    });
                    
                    await batch.commit();
                    
                    // 清空本地显示
                    if (messageArea) {
                        messageArea.innerHTML = `
                            <div style="text-align: center; color: #666666; margin-top: 30px; padding: 20px;">
                                <i class="fas fa-check-circle" style="font-size: 48px; color: #00a651; margin-bottom: 15px; display: block;"></i>
                                <div style="font-size: 16px; font-weight: bold; color: #000080; margin-bottom: 8px;">All messages cleared!</div>
                                <div style="font-size: 12px; color: #666;">Start a new conversation...</div>
                            </div>
                        `;
                    }
                    
                    // 显示成功提示
                    confirmDialog.remove();
                    
                    // 短暂显示成功消息
                    setTimeout(() => {
                        addMessage('System', 'Chat history cleared successfully', false, true);
                    }, 500);
                    
                } catch (error) {
                    console.error('Failed to clear messages:', error);
                    confirmBtn.disabled = false;
                    confirmBtn.innerHTML = originalText;
                    alert('Failed to clear messages. Please try again.');
                }
            });
        }
        
        // 添加消息到聊天区域
        function addMessage(sender, text, isSelf = false, isSystem = false) {
            const messageDiv = document.createElement('div');
            messageDiv.style.marginBottom = '12px';
            
            if (isSystem) {
                messageDiv.style.textAlign = 'center';
                messageDiv.style.padding = '8px';
                messageDiv.style.margin = '8px 0';
                messageDiv.style.background = 'linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%)';
                messageDiv.style.border = '1px solid #c0c0c0';
                messageDiv.style.borderRadius = '6px';
                messageDiv.style.color = '#666666';
                messageDiv.style.fontStyle = 'italic';
                messageDiv.style.fontSize = '11px';
                messageDiv.style.fontWeight = 'bold';
                messageDiv.innerHTML = `<i class="fas fa-info-circle" style="margin-right: 5px; color: #000080;"></i>${text} ${getCurrentTime()}`;
            } else {
                messageDiv.style.textAlign = isSelf ? 'right' : 'left';
                
                const messageBubble = document.createElement('div');
                messageBubble.style.display = 'inline-block';
                messageBubble.style.maxWidth = '75%';
                messageBubble.style.padding = '10px 12px';
                messageBubble.style.border = '2px outset #c0c0c0';
                messageBubble.style.borderRadius = '8px';
                messageBubble.style.background = isSelf 
                    ? 'linear-gradient(135deg, #e6f3ff 0%, #cce7ff 100%)' 
                    : 'linear-gradient(135deg, #ffffff 0%, #f8f8f8 100%)';
                messageBubble.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                messageBubble.style.position = 'relative';
                
                const senderSpan = document.createElement('div');
                senderSpan.style.fontSize = '11px';
                senderSpan.style.fontWeight = 'bold';
                senderSpan.style.color = isSelf ? '#000080' : '#008000';
                senderSpan.style.marginBottom = '4px';
                senderSpan.style.display = 'flex';
                senderSpan.style.alignItems = 'center';
                senderSpan.innerHTML = `<i class="fas fa-user-circle" style="margin-right: 5px; font-size: 12px;"></i>${sender} <span style="margin-left: auto; font-weight: normal; color: #666666; font-size: 10px;">${getCurrentTime()}</span>`;
                messageBubble.appendChild(senderSpan);
                
                const textSpan = document.createElement('div');
                textSpan.style.fontSize = '12px';
                textSpan.style.lineHeight = '1.4';
                textSpan.style.color = '#333333';
                textSpan.textContent = text;
                messageBubble.appendChild(textSpan);
                
                messageDiv.appendChild(messageBubble);
            }
            
            messageArea.appendChild(messageDiv);
            
            // 只在用户已经在底部时才自动滚动（避免打断用户查看历史消息）
            if (isScrolledToBottom) {
                messageArea.scrollTop = messageArea.scrollHeight;
            } else {
                // 如果用户在查看历史消息，显示"新消息"提示按钮
                if (scrollToBottomBtn) {
                    scrollToBottomBtn.style.display = 'inline-block';
                }
            }
        }
        
        // 获取当前时间 (UTC)
        function getCurrentTime() {
            const now = new Date();
            return `[${now.getUTCHours().toString().padStart(2, '0')}:${now.getUTCMinutes().toString().padStart(2, '0')} UTC]`;
        }
        
        // 更新用户列表
        function updateUserList(users) {
            userList.innerHTML = '';
            
            if (users.length === 0) {
                const emptyMsg = document.createElement('div');
                emptyMsg.style.color = '#666666';
                emptyMsg.style.fontStyle = 'italic';
                emptyMsg.style.fontSize = '11px';
                emptyMsg.style.textAlign = 'center';
                emptyMsg.style.padding = '20px';
                emptyMsg.innerHTML = '<i class="fas fa-users" style="margin-right: 5px; color: #000080;"></i>没有在线用户';
                userList.appendChild(emptyMsg);
                return;
            }
            
            users.forEach(user => {
                const userDiv = document.createElement('div');
                userDiv.style.fontSize = '12px';
                userDiv.style.marginBottom = '6px';
                userDiv.style.padding = '6px 8px';
                userDiv.style.borderRadius = '4px';
                userDiv.style.background = user === username 
                    ? 'linear-gradient(135deg, #e6f3ff 0%, #cce7ff 100%)' 
                    : 'linear-gradient(135deg, #f8f8f8 0%, #f0f0f0 100%)';
                userDiv.style.border = user === username 
                    ? '1px solid #000080' 
                    : '1px solid #e0e0e0';
                userDiv.style.color = user === username ? '#000080' : '#333333';
                userDiv.style.fontWeight = user === username ? 'bold' : 'normal';
                userDiv.style.display = 'flex';
                userDiv.style.alignItems = 'center';
                userDiv.innerHTML = `<i class="fas fa-user-circle" style="margin-right: 8px; color: ${user === username ? '#000080' : '#008000'}; font-size: 14px;"></i> ${user}`;
                userList.appendChild(userDiv);
            });
        }
        
        // Firebase配置
        // ✅ 已配置完成
        const firebaseConfig = {
            apiKey: "AIzaSyCEgDvWOldi07pRz-3na8oQ7QkJR0pzzKc",
            authDomain: "big-pig-38efe.firebaseapp.com",
            projectId: "big-pig-38efe",
            storageBucket: "big-pig-38efe.firebasestorage.app",
            messagingSenderId: "443761891665",
            appId: "1:443761891665:web:e2246e398a6951128cdb70",
            measurementId: "G-ZM3BEXBYPW"
        };

        // 检查是否使用了默认配置
        function isDefaultConfig() {
            return firebaseConfig.apiKey === "请替换为你的API密钥" ||
                   firebaseConfig.projectId === "请替换为你的项目ID" ||
                   firebaseConfig.apiKey === "";
        }

        // 初始化Firebase
        if (!window.firebase) {
            // 动态加载Firebase SDK
            const script1 = document.createElement('script');
            script1.src = 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js';
            document.head.appendChild(script1);
            
            script1.onload = () => {
                const script2 = document.createElement('script');
                script2.src = 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js';
                document.head.appendChild(script2);
                
                script2.onload = () => {
                    try {
                        if (isDefaultConfig()) {
                            console.error('❌ Firebase配置错误：请按照 QUICK_SETUP.md 的说明配置Firebase');
                            console.error('📖 配置指南：https://console.firebase.google.com/');
                            return;
                        }
                        
                        firebase.initializeApp(firebaseConfig);
                        window.db = firebase.firestore();
                        console.log('✅ Firebase初始化成功');
                    } catch (error) {
                        console.error('❌ Firebase初始化失败:', error);
                        if (isDefaultConfig()) {
                            console.error('🔧 请按照 QUICK_SETUP.md 的说明配置Firebase');
                        }
                    }
                };
            };
        } else {
            console.log('✅ Firebase已存在');
        }

        // Firebase操作函数
        async function firebaseRequest(action, data) {
            try {
                // 检查配置
                if (isDefaultConfig()) {
                    return { 
                        success: false, 
                        message: '❌ 请先配置Firebase\n\n📖 配置步骤：\n1. 访问 https://console.firebase.google.com/\n2. 创建新项目\n3. 启用Firestore数据库\n4. 获取配置信息\n5. 更新 script.js 中的 firebaseConfig\n\n详细说明请查看 QUICK_SETUP.md' 
                    };
                }
                
                // 确保Firebase已初始化
                if (!window.db) {
                    return { success: false, message: '❌ Firebase未初始化，请刷新页面重试' };
                }
                
                switch (action) {
                    case 'register':
                        return await registerUser(data);
                    case 'login':
                        return await loginUser(data);
                    case 'sendMessage':
                        return await sendMessageToFirebase(data);
                    case 'getHistory':
                        return await getChatHistoryFromFirebase();
                    case 'getUsers':
                        return await getOnlineUsers();
                    default:
                        throw new Error('未知操作');
                }
            } catch (error) {
                console.error('❌ Firebase操作失败:', error);
                throw error;
            }
        }

        // 用户注册
        async function registerUser(data) {
            const { username, password, confirmPassword } = data;
            
            if (!username || !password || !confirmPassword) {
                return { success: false, message: '请填写所有必填字段' };
            }
            
            if (password !== confirmPassword) {
                return { success: false, message: '密码和确认密码不匹配' };
            }
            
            try {
                const userRef = window.db.collection('users');
                const snapshot = await userRef.where('username', '==', username).get();
                
                if (!snapshot.empty) {
                    return { success: false, message: 'Username already exists' };
                }
                
                // 简单的密码哈希（实际项目中应使用更安全的方法）
                const hashedPassword = btoa(password);
                
                await userRef.add({
                    username,
                    password: hashedPassword,
                    createdAt: new Date().toISOString()
                });
                
                return { success: true, message: 'Registration successful! Please login' };
            } catch (error) {
                return { success: false, message: 'Registration failed, please try again' };
            }
        }

        // 用户登录
        async function loginUser(data) {
            const { username, password } = data;
            
            if (!username || !password) {
                return { success: false, message: '请输入用户名和密码' };
            }
            
            try {
                const userRef = window.db.collection('users');
                const snapshot = await userRef.where('username', '==', username).get();
                
                if (snapshot.empty) {
                    return { success: false, message: '用户名不存在' };
                }
                
                const userDoc = snapshot.docs[0];
                const userData = userDoc.data();
                const hashedPassword = btoa(password);
                
                if (userData.password !== hashedPassword) {
                    return { success: false, message: 'Incorrect password' };
                }
                
                // 更新在线状态
                await userRef.doc(userDoc.id).update({
                    isOnline: true,
                    lastLogin: new Date().toISOString()
                });
                
                return { 
                    success: true, 
                    message: 'Login successful!',
                    username: username
                };
            } catch (error) {
                return { success: false, message: 'Login failed, please try again' };
            }
        }

        // 发送消息到Firebase
        async function sendMessageToFirebase(data) {
            const { username, text } = data;
            
            if (!username || !text) {
                return { success: false, message: '无效的消息' };
            }
            
            try {
                await window.db.collection('messages').add({
                    sender: username,
                    text: text,
                    timestamp: new Date().toISOString()
                });
                
                return { success: true, message: '消息发送成功' };
            } catch (error) {
                return { success: false, message: '发送失败，请重试' };
            }
        }

        // 从Firebase获取聊天历史
        async function getChatHistoryFromFirebase() {
            try {
                const messagesRef = window.db.collection('messages');
                const snapshot = await messagesRef.orderBy('timestamp', 'desc').limit(100).get();
                
                const messages = [];
                snapshot.forEach(doc => {
                    const data = doc.data();
                    messages.unshift({
                        type: 'message',
                        sender: data.sender,
                        text: data.text,
                        timestamp: data.timestamp
                    });
                });
                
                return { success: true, messages };
            } catch (error) {
                return { success: true, messages: [] };
            }
        }

        // 获取在线用户
        async function getOnlineUsers() {
            try {
                const usersRef = window.db.collection('users');
                const snapshot = await usersRef.where('isOnline', '==', true).get();
                
                const users = [];
                snapshot.forEach(doc => {
                    const data = doc.data();
                    users.push(data.username);
                });
                
                return { success: true, users };
            } catch (error) {
                return { success: true, users: [] };
            }
        }

        // 兼容性API请求函数
        async function apiRequest(action, data) {
            console.log('API请求:', action, data);
            try {
                const result = await firebaseRequest(action, data);
                console.log('API响应:', result);
                return result;
            } catch (error) {
                console.error('API请求失败:', error);
                return { success: false, message: '请求失败，请重试' };
            }
        }

        // 连接到服务器
        function connectToServer(callback) {
            console.log('connectToServer被调用');
            
                                    connectionStatus.innerHTML = '<i class="fas fa-circle" style="margin-right: 5px; color: #00cc00;"></i>Connected';
            connectionStatus.style.color = '#00cc00';
            connectionStatus.style.fontWeight = 'bold';
            sendButton.disabled = false;
            if (clearChatBtn) clearChatBtn.disabled = false;
            
            if (callback) {
                console.log('执行连接成功回调');
                callback();
            }
        }

        // Firebase实时监听
        let unsubscribeMessages = null;
        let unsubscribeUsers = null;

        function startFirebaseListeners() {
            // 确保Firebase已初始化
            if (!window.db) {
                console.log('Firebase未初始化，延迟启动监听器');
                setTimeout(startFirebaseListeners, 1000);
                return;
            }
            
            console.log('启动Firebase监听器');
            
            // 更新连接状态
            if (connectionStatus) {
                                        connectionStatus.innerHTML = '<i class="fas fa-circle" style="margin-right: 5px; color: #00ff00;"></i>Connected';
                connectionStatus.style.color = '#00ff00';
            }
            
            // 启用发送按钮和清空按钮
            if (sendButton) {
                sendButton.disabled = false;
            }
            if (clearChatBtn) {
                clearChatBtn.disabled = false;
            }
            
            // 监听新消息
            unsubscribeMessages = window.db.collection('messages')
                .orderBy('timestamp', 'desc')
                .limit(100)
                .onSnapshot((snapshot) => {
                    console.log('收到新消息:', snapshot.docs.length, '条');
                    const messages = [];
                    snapshot.forEach(doc => {
                        const data = doc.data();
                        messages.unshift({
                            type: 'message',
                            sender: data.sender,
                            text: data.text,
                            timestamp: data.timestamp
                        });
                    });
                    
                    // 更新消息显示
                    if (messageArea) {
                        messageArea.innerHTML = '';
                        messages.forEach(msg => {
                            addMessage(msg.sender, msg.text, msg.sender === username);
                        });
                        
                        // 只有当用户滚动到底部时才自动滚动
                        if (isScrolledToBottom) {
                            messageArea.scrollTop = messageArea.scrollHeight;
                        }
                    }
                }, (error) => {
                    console.error('监听消息失败:', error);
                    // 更新连接状态为错误
                    if (connectionStatus) {
                        connectionStatus.innerHTML = '<i class="fas fa-circle" style="margin-right: 5px; color: #ff4444;"></i>连接错误';
                        connectionStatus.style.color = '#ff4444';
                    }
                });

            // 监听在线用户
            unsubscribeUsers = window.db.collection('users')
                .where('isOnline', '==', true)
                .onSnapshot((snapshot) => {
                    console.log('在线用户更新:', snapshot.docs.length, '人');
                    const users = [];
                    snapshot.forEach(doc => {
                        const data = doc.data();
                        users.push(data.username);
                    });
                    if (userList) {
                        updateUserList(users);
                    }
                }, (error) => {
                    console.error('监听用户失败:', error);
                });
        }

        function stopFirebaseListeners() {
            if (unsubscribeMessages) {
                unsubscribeMessages();
                unsubscribeMessages = null;
            }
            if (unsubscribeUsers) {
                unsubscribeUsers();
                unsubscribeUsers = null;
            }
        }

        // 兼容性函数
        function startPolling() {
            startFirebaseListeners();
        }

        function stopPolling() {
            stopFirebaseListeners();
        }

        // 加载聊天历史
        async function loadChatHistory() {
            try {
                // Firebase实时监听会自动加载历史消息
                // 这里只需要启动监听器
                startFirebaseListeners();
            } catch (error) {
                console.error('加载聊天历史失败:', error);
            }
        }
    }

    activateWindow(windowElement) {
        // 将所有窗口置于后台
        this.windows.forEach(w => {
            w.element.style.zIndex = '500';
        });

        // 将当前窗口置于前台
        windowElement.style.zIndex = '501';
        this.activeWindow = windowElement;

        // 更新任务栏状态
        this.updateTaskbarActive(windowElement.id);
    }

    addToTaskbar(windowId, title) {
        const taskbarWindows = document.getElementById('taskbar-windows');
        const taskbarWindow = document.createElement('div');
        taskbarWindow.className = 'taskbar-window';
        taskbarWindow.textContent = title;
        taskbarWindow.dataset.windowId = windowId;
        
        taskbarWindow.addEventListener('click', () => {
            const window = document.getElementById(windowId);
            if (window) {
                this.activateWindow(window);
            }
        });

        taskbarWindows.appendChild(taskbarWindow);
    }

    updateTaskbarActive(windowId) {
        document.querySelectorAll('.taskbar-window').forEach(tw => {
            tw.classList.remove('active');
        });
        
        const activeTaskbarWindow = document.querySelector(`[data-window-id="${windowId}"]`);
        if (activeTaskbarWindow) {
            activeTaskbarWindow.classList.add('active');
        }
    }

    windowAction(window, action) {
        switch (action) {
            case 'minimize':
                window.style.display = 'none';
                break;
            case 'maximize':
                if (window.classList.contains('maximized')) {
                    // 从最大化状态恢复
                    window.classList.remove('maximized');
                    
                    // 恢复原始尺寸，但位置居中显示
                    const originalWidth = window.getAttribute('data-original-width') || '400px';
                    const originalHeight = window.getAttribute('data-original-height') || '300px';
                    
                    window.style.width = originalWidth;
                    window.style.height = originalHeight;
                    window.style.left = '50%';
                    window.style.top = '50%';
                    window.style.transform = 'translate(-50%, -50%)';
                } else {
                    // 保存当前尺寸，然后最大化
                    window.setAttribute('data-original-width', window.style.width);
                    window.setAttribute('data-original-height', window.style.height);
                    
                    window.classList.add('maximized');
                    window.style.width = '100%';
                    window.style.height = 'calc(100% - 30px)';
                    window.style.left = '0';
                    window.style.top = '0';
                    window.style.transform = 'none';
                }
                break;
            case 'close':
                const windowId = window.id;
                window.remove();
                this.windows = this.windows.filter(w => w.id !== windowId);
                
                // 从任务栏移除
                const taskbarWindow = document.querySelector(`[data-window-id="${windowId}"]`);
                if (taskbarWindow) {
                    taskbarWindow.remove();
                }
                break;
        }
    }

    startWindowDragging(window, e) {
        this.isDragging = true;
        this.activeWindow = window;
        
        // 如果窗口当前是居中定位，转换为像素定位
        if (window.style.left === '50%' && window.style.top === '50%') {
            const rect = window.getBoundingClientRect();
            window.style.left = rect.left + 'px';
            window.style.top = rect.top + 'px';
            window.style.transform = 'none';
        }
        
        const rect = window.getBoundingClientRect();
        this.dragOffset.x = e.clientX - rect.left;
        this.dragOffset.y = e.clientY - rect.top;
        
        const moveHandler = (e) => {
            if (this.isDragging) {
                const x = e.clientX - this.dragOffset.x;
                const y = e.clientY - this.dragOffset.y;
                window.style.left = x + 'px';
                window.style.top = y + 'px';
                // 移除transform，避免与像素定位冲突
                window.style.transform = 'none';
            }
        };
        
        const upHandler = () => {
            this.isDragging = false;
            // 保存当前位置，避免窗口跳回居中位置
            const currentLeft = window.style.left;
            const currentTop = window.style.top;
            window.setAttribute('data-current-left', currentLeft);
            window.setAttribute('data-current-top', currentTop);
            document.removeEventListener('mousemove', moveHandler);
            document.removeEventListener('mouseup', upHandler);
        };
        
        document.addEventListener('mousemove', moveHandler);
        document.addEventListener('mouseup', upHandler);
    }

    // 桌面图标拖拽功能已移除，因为现在使用垂直排列布局

    toggleStartMenu() {
        const startMenu = document.getElementById('start-menu');
        startMenu.classList.toggle('show');
    }

    hideStartMenu() {
        document.getElementById('start-menu').classList.remove('show');
    }

    showAllProgramsMenu() {
        document.getElementById('all-programs-menu').classList.add('show');
    }

    hideAllProgramsMenu() {
        document.getElementById('all-programs-menu').classList.remove('show');
    }

    showContextMenu(x, y) {
        const contextMenu = document.getElementById('context-menu');
        contextMenu.style.left = x + 'px';
        contextMenu.style.top = y + 'px';
        contextMenu.classList.add('show');
    }

    hideContextMenu() {
        document.getElementById('context-menu').classList.remove('show');
    }

    showDesktop() {
        this.windows.forEach(w => {
            w.element.style.display = 'none';
        });
    }

    updateClock() {
        const updateTime = () => {
            const now = new Date();
            const timeString = now.toISOString().slice(11, 16) + ' UTC';
            document.getElementById('current-time').textContent = timeString;
        };
        
        updateTime();
        setInterval(updateTime, 1000);
    }

    changeWallpaper() {
        // Create wallpaper selection window
        const wallpaperWindow = this.createWindow({
            title: 'Change Wallpaper',
            width: 500,
            height: 400,
            content: `
                <div style="padding: 20px;">
                    <h3>Select Desktop Wallpaper</h3>
                    <div style="margin-top: 20px;">
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
                            <div style="text-align: center; cursor: pointer; padding: 10px; border: 2px solid #ccc; border-radius: 5px;" onclick="windowsXP.setWallpaper('png/2.png')">
                                <img src="png/2.png" alt="Wallpaper 1" style="width: 100%; height: 120px; object-fit: cover; border-radius: 3px; margin-bottom: 10px;">
                                <div style="font-weight: bold;">Wallpaper 1</div>
                            </div>
                            <div style="text-align: center; cursor: pointer; padding: 10px; border: 2px solid #ccc; border-radius: 5px;" onclick="windowsXP.setWallpaper('png/3.png')">
                                <img src="png/3.png" alt="Wallpaper 2" style="width: 100%; height: 120px; object-fit: cover; border-radius: 3px; margin-bottom: 10px;">
                                <div style="font-weight: bold;">Wallpaper 2</div>
                            </div>
                            <div style="text-align: center; cursor: pointer; padding: 10px; border: 2px solid #ccc; border-radius: 5px;" onclick="windowsXP.setWallpaper('png/4.png')">
                                <img src="png/4.png" alt="Wallpaper 3" style="width: 100%; height: 120px; object-fit: cover; border-radius: 3px; margin-bottom: 10px;">
                                <div style="font-weight: bold;">Wallpaper 3</div>
                            </div>
                            <div style="text-align: center; cursor: pointer; padding: 10px; border: 2px solid #ccc; border-radius: 5px;" onclick="windowsXP.setWallpaper('png/0.png')">
                                <img src="png/0.png" alt="Default Wallpaper" style="width: 100%; height: 120px; object-fit: cover; border-radius: 3px; margin-bottom: 10px;">
                                <div style="font-weight: bold;">Default Wallpaper</div>
                            </div>
                        </div>
                        <div style="margin-top: 20px; text-align: center;">
                            <p style="color: #666; font-size: 12px;">Click any wallpaper to apply</p>
                        </div>
                    </div>
                </div>
            `
        });
    }

    setWallpaper(wallpaperFile) {
        const desktop = document.getElementById('desktop');
        
        // Set wallpaper (now all wallpapers are image files)
            desktop.style.background = `url('${wallpaperFile}') center/cover`;
        
        // Save wallpaper settings to local storage
        localStorage.setItem('wallpaper', wallpaperFile);
        
        // Close wallpaper selection window
        const wallpaperWindow = document.querySelector('.window[data-title="Change Wallpaper"]');
        if (wallpaperWindow) {
            this.windowAction(wallpaperWindow, 'close');
        }
    }

    createGamesContent() {
        return `
            <div style="padding: 30px; text-align: center;">
                <h3 style="margin-bottom: 20px;">Game Center</h3>
                <div style="display: flex; justify-content: center; gap: 40px; flex-wrap: wrap;">
                    <div style="cursor: pointer; display: inline-block; padding: 15px; background: linear-gradient(135deg, #f8f8f8 0%, #e8e8e8 100%); border: 2px outset #c0c0c0; border-radius: 8px; transition: all 0.2s ease;" onclick="windowsXP.launchSnakeGame()">
                        <img src='png/6.png' alt='Snake Game' style='width: 80px; height: 80px; object-fit: contain; margin-bottom: 10px;'><br>
                        <span style='font-size: 14px; font-weight: bold; color: #245edc;'>Snake Game</span>
                    </div>
                    
                    <div style="display: inline-block; padding: 15px; background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%); border: 2px inset #c0c0c0; border-radius: 8px; opacity: 0.7; position: relative;">
                        <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #cccccc 0%, #999999 100%); border: 2px inset #c0c0c0; border-radius: 4px; display: flex; align-items: center; justify-content: center; margin-bottom: 10px;">
                            <i class="fas fa-tools" style="font-size: 32px; color: #666;"></i>
                        </div>
                        <span style='font-size: 14px; font-weight: bold; color: #666;'>Mystery Game</span>
                        <div style="position: absolute; top: 5px; right: 5px; background: #ff6b35; color: white; font-size: 10px; padding: 2px 6px; border-radius: 10px; font-weight: bold;">DEV</div>
                    </div>
                    
                    <div style="display: inline-block; padding: 15px; background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%); border: 2px inset #c0c0c0; border-radius: 8px; opacity: 0.7; position: relative;">
                        <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #cccccc 0%, #999999 100%); border: 2px inset #c0c0c0; border-radius: 4px; display: flex; align-items: center; justify-content: center; margin-bottom: 10px;">
                            <i class="fas fa-gamepad" style="font-size: 32px; color: #666;"></i>
                        </div>
                        <span style='font-size: 14px; font-weight: bold; color: #666;'>Arcade Classic</span>
                        <div style="position: absolute; top: 5px; right: 5px; background: #ff6b35; color: white; font-size: 10px; padding: 2px 6px; border-radius: 10px; font-weight: bold;">DEV</div>
                    </div>
                </div>
                
                <div style="margin-top: 30px; padding: 15px; background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%); border: 2px outset #c0c0c0; border-radius: 8px;">
                    <h4 style="color: #856404; margin-bottom: 10px; font-size: 14px;">Development Status</h4>
                    <div style="font-size: 12px; color: #856404; line-height: 1.4;">
                        <div style="margin-bottom: 5px;">• Snake Game: ✅ Available</div>
                        <div style="margin-bottom: 5px;">• Mystery Game: 🔧 In Development</div>
                        <div style="margin-bottom: 5px;">• Arcade Classic: 🔧 In Development</div>
                        <div style="margin-top: 10px; font-style: italic;">More games coming soon...</div>
                    </div>
                </div>
            </div>
        `;
    }
    launchSnakeGame() {
        this.createWindow({
            title: 'Snake Game',
            width: 900,
            height: 700,
            content: `<iframe src='snake.html' style='width:100%;height:100%;border:none;background:#222;'></iframe>`
        });
    }

    openSystemSettings() {
        this.createWindow({
            title: 'System Settings',
            width: 600,
            height: 500,
            content: `
                <div style="padding: 20px; font-family: 'Tahoma', sans-serif;">
                    <h3 style="color: #245edc; margin-bottom: 20px;">System Settings</h3>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        <!-- Display Settings -->
                        <div style="background: linear-gradient(135deg, #f8f8f8 0%, #e8e8e8 100%); border: 2px outset #c0c0c0; border-radius: 8px; padding: 15px;">
                            <h4 style="color: #245edc; margin-bottom: 10px;">Display Settings</h4>
                            <div style="margin-bottom: 10px;">
                                <label style="display: block; margin-bottom: 5px; font-weight: bold;">Screen Resolution:</label>
                                <select style="width: 100%; padding: 5px; border: 2px inset #c0c0c0; border-radius: 3px;">
                                    <option>1920 x 1080 (Recommended)</option>
                                    <option>1600 x 900</option>
                                    <option>1366 x 768</option>
                                    <option>1280 x 720</option>
                                </select>
                            </div>
                            <div style="margin-bottom: 10px;">
                                <label style="display: block; margin-bottom: 5px; font-weight: bold;">Color Quality:</label>
                                <select style="width: 100%; padding: 5px; border: 2px inset #c0c0c0; border-radius: 3px;">
                                    <option>32-bit (Recommended)</option>
                                    <option>24-bit</option>
                                    <option>16-bit</option>
                                </select>
                            </div>
                            <div>
                                <label style="display: block; margin-bottom: 5px; font-weight: bold;">Refresh Rate:</label>
                                <select style="width: 100%; padding: 5px; border: 2px inset #c0c0c0; border-radius: 3px;">
                                    <option>60 Hz</option>
                                    <option>75 Hz</option>
                                    <option>120 Hz</option>
                                </select>
                            </div>
                        </div>
                        
                        <!-- Sound Settings -->
                        <div style="background: linear-gradient(135deg, #f8f8f8 0%, #e8e8e8 100%); border: 2px outset #c0c0c0; border-radius: 8px; padding: 15px;">
                            <h4 style="color: #245edc; margin-bottom: 10px;">Sound Settings</h4>
                            <div style="margin-bottom: 10px;">
                                <label style="display: block; margin-bottom: 5px; font-weight: bold;">Volume:</label>
                                <input type="range" min="0" max="100" value="75" style="width: 100%;">
                                <div style="text-align: center; font-size: 12px; color: #666;">75%</div>
                            </div>
                            <div style="margin-bottom: 10px;">
                                <label style="display: block; margin-bottom: 5px; font-weight: bold;">Default Device:</label>
                                <select style="width: 100%; padding: 5px; border: 2px inset #c0c0c0; border-radius: 3px;">
                                    <option>Speakers (Realtek Audio)</option>
                                    <option>Headphones (USB Audio)</option>
                                    <option>HDMI Audio</option>
                                </select>
                            </div>
                            <div>
                                <label style="display: block; margin-bottom: 5px; font-weight: bold;">Sample Rate:</label>
                                <select style="width: 100%; padding: 5px; border: 2px inset #c0c0c0; border-radius: 3px;">
                                    <option>44.1 kHz</option>
                                    <option>48 kHz</option>
                                    <option>96 kHz</option>
                                </select>
                            </div>
                        </div>
                        
                        <!-- Power Settings -->
                        <div style="background: linear-gradient(135deg, #f8f8f8 0%, #e8e8e8 100%); border: 2px outset #c0c0c0; border-radius: 8px; padding: 15px;">
                            <h4 style="color: #245edc; margin-bottom: 10px;">Power Settings</h4>
                            <div style="margin-bottom: 10px;">
                                <label style="display: block; margin-bottom: 5px; font-weight: bold;">Power Plan:</label>
                                <select style="width: 100%; padding: 5px; border: 2px inset #c0c0c0; border-radius: 3px;">
                                    <option>Balanced (Recommended)</option>
                                    <option>High Performance</option>
                                    <option>Power Saver</option>
                                </select>
                            </div>
                            <div style="margin-bottom: 10px;">
                                <label style="display: block; margin-bottom: 5px; font-weight: bold;">Sleep After:</label>
                                <select style="width: 100%; padding: 5px; border: 2px inset #c0c0c0; border-radius: 3px;">
                                    <option>15 minutes</option>
                                    <option>30 minutes</option>
                                    <option>1 hour</option>
                                    <option>Never</option>
                                </select>
                            </div>
                            <div>
                                <label style="display: block; margin-bottom: 5px; font-weight: bold;">Display Off:</label>
                                <select style="width: 100%; padding: 5px; border: 2px inset #c0c0c0; border-radius: 3px;">
                                    <option>10 minutes</option>
                                    <option>15 minutes</option>
                                    <option>30 minutes</option>
                                </select>
                            </div>
                        </div>
                        
                        <!-- Security Settings -->
                        <div style="background: linear-gradient(135deg, #f8f8f8 0%, #e8e8e8 100%); border: 2px outset #c0c0c0; border-radius: 8px; padding: 15px;">
                            <h4 style="color: #245edc; margin-bottom: 10px;">Security Settings</h4>
                            <div style="margin-bottom: 10px;">
                                <label style="display: flex; align-items: center; margin-bottom: 5px;">
                                    <input type="checkbox" checked style="margin-right: 8px;">
                                    <span style="font-weight: bold;">Windows Firewall</span>
                                </label>
                            </div>
                            <div style="margin-bottom: 10px;">
                                <label style="display: flex; align-items: center; margin-bottom: 5px;">
                                    <input type="checkbox" checked style="margin-right: 8px;">
                                    <span style="font-weight: bold;">Automatic Updates</span>
                                </label>
                            </div>
                            <div style="margin-bottom: 10px;">
                                <label style="display: flex; align-items: center; margin-bottom: 5px;">
                                    <input type="checkbox" style="margin-right: 8px;">
                                    <span style="font-weight: bold;">User Account Control</span>
                                </label>
                            </div>
                            <div>
                                <label style="display: flex; align-items: center; margin-bottom: 5px;">
                                    <input type="checkbox" checked style="margin-right: 8px;">
                                    <span style="font-weight: bold;">SmartScreen Filter</span>
                                </label>
                            </div>
                        </div>
                    </div>
                    
                    <div style="margin-top: 20px; text-align: center;">
                        <button style="
                            padding: 8px 16px;
                            background: linear-gradient(135deg, #245edc 0%, #4a6fd8 100%);
                            color: white;
                            border: 2px outset #c0c0c0;
                            border-radius: 4px;
                            cursor: pointer;
                            font-family: 'Tahoma', sans-serif;
                            font-size: 12px;
                            margin-right: 10px;
                        ">Apply</button>
                        <button style="
                            padding: 8px 16px;
                            background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%);
                            color: white;
                            border: 2px outset #c0c0c0;
                            border-radius: 4px;
                            cursor: pointer;
                            font-family: 'Tahoma', sans-serif;
                            font-size: 12px;
                        ">Cancel</button>
                    </div>
                </div>
            `
        });
    }

    openUserProfile() {
        this.createWindow({
            title: 'User Profile',
            width: 500,
            height: 400,
            content: `
                <div style="padding: 20px; font-family: 'Tahoma', sans-serif;">
                    <h3 style="color: #245edc; margin-bottom: 20px;">User Account Settings</h3>
                    
                    <div style="background: linear-gradient(135deg, #f8f8f8 0%, #e8e8e8 100%); border: 2px outset #c0c0c0; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                        <h4 style="color: #245edc; margin-bottom: 15px;">Account Information</h4>
                        
                        <div style="margin-bottom: 15px;">
                            <label style="display: block; margin-bottom: 5px; font-weight: bold;">Username:</label>
                            <input type="text" value="Administrator" style="width: 100%; padding: 8px; border: 2px inset #c0c0c0; border-radius: 3px; font-family: 'Tahoma', sans-serif;">
                        </div>
                        
                        <div style="margin-bottom: 15px;">
                            <label style="display: block; margin-bottom: 5px; font-weight: bold;">Full Name:</label>
                            <input type="text" value="System Administrator" style="width: 100%; padding: 8px; border: 2px inset #c0c0c0; border-radius: 3px; font-family: 'Tahoma', sans-serif;">
                        </div>
                        
                        <div style="margin-bottom: 15px;">
                            <label style="display: block; margin-bottom: 5px; font-weight: bold;">Email:</label>
                            <input type="email" value="admin@bnbxp.local" style="width: 100%; padding: 8px; border: 2px inset #c0c0c0; border-radius: 3px; font-family: 'Tahoma', sans-serif;">
                        </div>
                        
                        <div style="margin-bottom: 15px;">
                            <label style="display: block; margin-bottom: 5px; font-weight: bold;">Account Type:</label>
                            <select style="width: 100%; padding: 8px; border: 2px inset #c0c0c0; border-radius: 3px; font-family: 'Tahoma', sans-serif;">
                                <option>Administrator</option>
                                <option>Standard User</option>
                                <option>Guest</option>
                            </select>
                        </div>
                    </div>
                    
                    <div style="background: linear-gradient(135deg, #f8f8f8 0%, #e8e8e8 100%); border: 2px outset #c0c0c0; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                        <h4 style="color: #245edc; margin-bottom: 15px;">Security Settings</h4>
                        
                        <div style="margin-bottom: 15px;">
                            <label style="display: flex; align-items: center; margin-bottom: 5px;">
                                <input type="checkbox" checked style="margin-right: 8px;">
                                <span style="font-weight: bold;">Require password on login</span>
                            </label>
                        </div>
                        
                        <div style="margin-bottom: 15px;">
                            <label style="display: flex; align-items: center; margin-bottom: 5px;">
                                <input type="checkbox" style="margin-right: 8px;">
                                <span style="font-weight: bold;">Enable two-factor authentication</span>
                            </label>
                        </div>
                        
                        <div style="margin-bottom: 15px;">
                            <label style="display: flex; align-items: center; margin-bottom: 5px;">
                                <input type="checkbox" checked style="margin-right: 8px;">
                                <span style="font-weight: bold;">Lock account after failed attempts</span>
                            </label>
                        </div>
                    </div>
                    
                    <div style="text-align: center;">
                        <button style="
                            padding: 8px 16px;
                            background: linear-gradient(135deg, #245edc 0%, #4a6fd8 100%);
                            color: white;
                            border: 2px outset #c0c0c0;
                            border-radius: 4px;
                            cursor: pointer;
                            font-family: 'Tahoma', sans-serif;
                            font-size: 12px;
                            margin-right: 10px;
                        ">Save Changes</button>
                        <button style="
                            padding: 8px 16px;
                            background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
                            color: white;
                            border: 2px outset #c0c0c0;
                            border-radius: 4px;
                            cursor: pointer;
                            font-family: 'Tahoma', sans-serif;
                            font-size: 12px;
                        ">Change Password</button>
                    </div>
                </div>
            `
        });
    }

    openNetworkSettings() {
        this.createWindow({
            title: 'Network Settings',
            width: 600,
            height: 500,
            content: `
                <div style="padding: 20px; font-family: 'Tahoma', sans-serif;">
                    <h3 style="color: #245edc; margin-bottom: 20px;">Network Configuration</h3>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        <!-- Connection Status -->
                        <div style="background: linear-gradient(135deg, #f8f8f8 0%, #e8e8e8 100%); border: 2px outset #c0c0c0; border-radius: 8px; padding: 15px;">
                            <h4 style="color: #245edc; margin-bottom: 10px;">Connection Status</h4>
                            <div style="margin-bottom: 10px;">
                                <span style="font-weight: bold;">Status:</span>
                                <span style="color: #28a745; font-weight: bold;">Connected</span>
                            </div>
                            <div style="margin-bottom: 10px;">
                                <span style="font-weight: bold;">Type:</span>
                                <span>Ethernet</span>
                            </div>
                            <div style="margin-bottom: 10px;">
                                <span style="font-weight: bold;">Speed:</span>
                                <span>100 Mbps</span>
                            </div>
                            <div>
                                <span style="font-weight: bold;">IP Address:</span>
                                <span>192.168.1.100</span>
                            </div>
                        </div>
                        
                        <!-- Network Adapters -->
                        <div style="background: linear-gradient(135deg, #f8f8f8 0%, #e8e8e8 100%); border: 2px outset #c0c0c0; border-radius: 8px; padding: 15px;">
                            <h4 style="color: #245edc; margin-bottom: 10px;">Network Adapters</h4>
                            <div style="margin-bottom: 10px;">
                                <label style="display: flex; align-items: center; margin-bottom: 5px;">
                                    <input type="radio" name="adapter" checked style="margin-right: 8px;">
                                    <span>Realtek PCIe GbE Family Controller</span>
                                </label>
                            </div>
                            <div style="margin-bottom: 10px;">
                                <label style="display: flex; align-items: center; margin-bottom: 5px;">
                                    <input type="radio" name="adapter" style="margin-right: 8px;">
                                    <span>Intel(R) Wireless-AC 9560</span>
                                </label>
                            </div>
                            <div>
                                <label style="display: flex; align-items: center; margin-bottom: 5px;">
                                    <input type="radio" name="adapter" style="margin-right: 8px;">
                                    <span>Bluetooth Network Connection</span>
                                </label>
                            </div>
                        </div>
                        
                        <!-- IP Configuration -->
                        <div style="background: linear-gradient(135deg, #f8f8f8 0%, #e8e8e8 100%); border: 2px outset #c0c0c0; border-radius: 8px; padding: 15px;">
                            <h4 style="color: #245edc; margin-bottom: 10px;">IP Configuration</h4>
                            <div style="margin-bottom: 10px;">
                                <label style="display: block; margin-bottom: 5px; font-weight: bold;">IP Address:</label>
                                <input type="text" value="192.168.1.100" style="width: 100%; padding: 5px; border: 2px inset #c0c0c0; border-radius: 3px;">
                            </div>
                            <div style="margin-bottom: 10px;">
                                <label style="display: block; margin-bottom: 5px; font-weight: bold;">Subnet Mask:</label>
                                <input type="text" value="255.255.255.0" style="width: 100%; padding: 5px; border: 2px inset #c0c0c0; border-radius: 3px;">
                            </div>
                            <div style="margin-bottom: 10px;">
                                <label style="display: block; margin-bottom: 5px; font-weight: bold;">Default Gateway:</label>
                                <input type="text" value="192.168.1.1" style="width: 100%; padding: 5px; border: 2px inset #c0c0c0; border-radius: 3px;">
                            </div>
                            <div>
                                <label style="display: block; margin-bottom: 5px; font-weight: bold;">DNS Server:</label>
                                <input type="text" value="8.8.8.8" style="width: 100%; padding: 5px; border: 2px inset #c0c0c0; border-radius: 3px;">
                            </div>
                        </div>
                        
                        <!-- Network Security -->
                        <div style="background: linear-gradient(135deg, #f8f8f8 0%, #e8e8e8 100%); border: 2px outset #c0c0c0; border-radius: 8px; padding: 15px;">
                            <h4 style="color: #245edc; margin-bottom: 10px;">Network Security</h4>
                            <div style="margin-bottom: 10px;">
                                <label style="display: flex; align-items: center; margin-bottom: 5px;">
                                    <input type="checkbox" checked style="margin-right: 8px;">
                                    <span style="font-weight: bold;">Enable Firewall</span>
                                </label>
                            </div>
                            <div style="margin-bottom: 10px;">
                                <label style="display: flex; align-items: center; margin-bottom: 5px;">
                                    <input type="checkbox" checked style="margin-right: 8px;">
                                    <span style="font-weight: bold;">Block Incoming Connections</span>
                                </label>
                            </div>
                            <div style="margin-bottom: 10px;">
                                <label style="display: flex; align-items: center; margin-bottom: 5px;">
                                    <input type="checkbox" style="margin-right: 8px;">
                                    <span style="font-weight: bold;">Enable VPN</span>
                                </label>
                            </div>
                            <div>
                                <label style="display: flex; align-items: center; margin-bottom: 5px;">
                                    <input type="checkbox" checked style="margin-right: 8px;">
                                    <span style="font-weight: bold;">Network Discovery</span>
                                </label>
                            </div>
                        </div>
                    </div>
                    
                    <div style="margin-top: 20px; text-align: center;">
                        <button style="
                            padding: 8px 16px;
                            background: linear-gradient(135deg, #245edc 0%, #4a6fd8 100%);
                            color: white;
                            border: 2px outset #c0c0c0;
                            border-radius: 4px;
                            cursor: pointer;
                            font-family: 'Tahoma', sans-serif;
                            font-size: 12px;
                            margin-right: 10px;
                        ">Apply Settings</button>
                        <button style="
                            padding: 8px 16px;
                            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
                            color: white;
                            border: 2px outset #c0c0c0;
                            border-radius: 4px;
                            cursor: pointer;
                            font-family: 'Tahoma', sans-serif;
                            font-size: 12px;
                            margin-right: 10px;
                        ">Test Connection</button>
                        <button style="
                            padding: 8px 16px;
                            background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%);
                            color: white;
                            border: 2px outset #c0c0c0;
                            border-radius: 4px;
                            cursor: pointer;
                            font-family: 'Tahoma', sans-serif;
                            font-size: 12px;
                        ">Reset</button>
                    </div>
                </div>
            `
        });
    }
}

// Initialize Windows XP Simulator
document.addEventListener('DOMContentLoaded', () => {
    window.windowsXP = new WindowsXP();
    
    // Load saved wallpaper settings
    const savedWallpaper = localStorage.getItem('wallpaper');
    if (savedWallpaper) {
        const desktop = document.getElementById('desktop');
        desktop.style.background = `url('${savedWallpaper}') center/cover`;
    } else {
        // Set default wallpaper if none is saved
        const desktop = document.getElementById('desktop');
        desktop.style.background = `url('png/0.png') center/cover`;
    }
});

// Global variables for auto-update functionality
let autoUpdateInterval = null;
let isAutoUpdateEnabled = true;

// Global function to update system statistics
function updateSystemStats() {
    // Generate random values for demonstration
    const cpuUsage = Math.floor(Math.random() * 60) + 20; // 20-80%
    const memoryUsage = Math.floor(Math.random() * 50) + 40; // 40-90%
    const gpuUsage = Math.floor(Math.random() * 70) + 10; // 10-80%
    const networkUsage = Math.floor(Math.random() * 30) + 5; // 5-35%
    
    // Update CPU
    const cpuElement = document.getElementById('cpu-usage');
    const cpuBar = document.getElementById('cpu-bar');
    if (cpuElement && cpuBar) {
        cpuElement.textContent = cpuUsage + '%';
        cpuBar.style.width = cpuUsage + '%';
    }
    
    // Update Memory
    const memoryElement = document.getElementById('memory-usage');
    const memoryBar = document.getElementById('memory-bar');
    if (memoryElement && memoryBar) {
        memoryElement.textContent = memoryUsage + '%';
        memoryBar.style.width = memoryUsage + '%';
    }
    
    // Update GPU
    const gpuElement = document.getElementById('gpu-usage');
    const gpuBar = document.getElementById('gpu-bar');
    if (gpuElement && gpuBar) {
        gpuElement.textContent = gpuUsage + '%';
        gpuBar.style.width = gpuUsage + '%';
    }
    
    // Update Network
    const networkElement = document.getElementById('network-usage');
    const networkBar = document.getElementById('network-bar');
    if (networkElement && networkBar) {
        networkElement.textContent = networkUsage + '%';
        networkBar.style.width = networkUsage + '%';
    }
}

// Function to toggle auto-update
function toggleAutoUpdate() {
    const btn = document.getElementById('auto-update-btn');
    
    if (isAutoUpdateEnabled) {
        // Turn off auto-update
        if (autoUpdateInterval) {
            clearInterval(autoUpdateInterval);
            autoUpdateInterval = null;
        }
        isAutoUpdateEnabled = false;
        btn.textContent = 'Auto Update: OFF';
        btn.style.background = 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)';
    } else {
        // Turn on auto-update
        startAutoUpdate();
        isAutoUpdateEnabled = true;
        btn.textContent = 'Auto Update: ON';
        btn.style.background = 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';
    }
}

// Function to start auto-update
function startAutoUpdate() {
    if (autoUpdateInterval) {
        clearInterval(autoUpdateInterval);
    }
    autoUpdateInterval = setInterval(updateSystemStats, 2000); // Update every 2 seconds
}

// Start auto-update when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Start auto-update after a short delay to ensure the window is created
    setTimeout(() => {
        if (isAutoUpdateEnabled) {
            startAutoUpdate();
        }
    }, 1000);
}); 
