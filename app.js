// ==================== APP GLOBAL STATE ====================

const state = {
    activeBlock: null,     // Currently open top-level overlay: 'experience', 'skills', etc.
    activeProject: null,   // Active project: 'voltage_det', 'motor_driver', 'translation_chip', 'router_sim', etc.
    projectHierarchy: [],  // Array tracking current path, e.g., ['top', 'vd_2v', 'detector_main', 'comparator']
    
    // Pathbuffer Simulation State
    pathbufCap: 120        // default load capacitance in fF
};

// ==================== HIERARCHICAL PROJECTS DATA ====================

const PROJECTS_DATA = {
    voltage_det: {
        title: "Voltage Detection IP",
        process: "130nm LBC9",
        levels: {
            top: {
                title: "Voltage Detection IP [Top Level]",
                scale: "1X SCALE",
                props: {
                    "Cell Name": "voltage_detector_top",
                    "Process Node": "130nm LBC9",
                    "Supply Voltage": "1.8V / 5.0V",
                    "Silicon Area": "240 um x 160 um",
                    "DRC / LVS": "Passed / Clean"
                },
                specs: "Top-level floorplan of a multi-stage voltage detector designed for interface isolation devices. Contains high-voltage interface logic, control buffers, and three matched voltage detection blocks.",
                role: "Designed the physical layout using common-centroid matching for input stages, guard rings for substrate isolation, and thick power rings (Metal 3) to minimize voltage drop.",
                graphics: `
                    <svg viewBox="0 0 400 240" width="100%" height="100%">
                        <rect width="100%" height="100%" fill="none" stroke="var(--dt)" stroke-width="2" class="layer-dt" stroke-dasharray="8,4"/>
                        
                        <!-- 2V Block -->
                        <g class="drill-cell" data-goto="vd_2v" transform="translate(30, 40)">
                            <rect width="100" height="150" fill="var(--nwell-solid)" stroke="var(--metal2)" stroke-width="2" class="layer-metal2"/>
                            <text x="50" y="80" text-anchor="middle" fill="#FFFFFF" font-size="11" font-family="monospace">VD_2V_CELL</text>
                            <text x="50" y="100" text-anchor="middle" fill="var(--text-secondary)" font-size="8" font-family="monospace">130nm</text>
                        </g>

                        <!-- 4V Block -->
                        <g class="drill-cell" data-goto="vd_4v" transform="translate(150, 40)">
                            <rect width="100" height="150" fill="var(--nwell-solid)" stroke="var(--metal2)" stroke-width="2" class="layer-metal2"/>
                            <text x="50" y="80" text-anchor="middle" fill="#FFFFFF" font-size="11" font-family="monospace">VD_4V_CELL</text>
                            <text x="50" y="100" text-anchor="middle" fill="var(--text-secondary)" font-size="8" font-family="monospace">130nm</text>
                        </g>

                        <!-- 7V Block -->
                        <g class="drill-cell" data-goto="vd_7v" transform="translate(270, 40)">
                            <rect width="100" height="150" fill="var(--nwell-solid)" stroke="var(--metal2)" stroke-width="2" class="layer-metal2"/>
                            <text x="50" y="80" text-anchor="middle" fill="#FFFFFF" font-size="11" font-family="monospace">VD_7V_CELL</text>
                            <text x="50" y="100" text-anchor="middle" fill="var(--text-secondary)" font-size="8" font-family="monospace">130nm</text>
                        </g>
                    </svg>
                `
            },
            vd_2v: {
                title: "Voltage Detector 2V Block",
                scale: "2.5X SCALE",
                props: {
                    "Cell Name": "voltage_detector_2v",
                    "Hierarchy Parent": "voltage_detector_top",
                    "Silicon Area": "70 um x 110 um",
                    "Voltage Threshold": "2.0 V",
                    "Shielding": "Fully Shielded Coaxial Lines"
                },
                specs: "A dedicated detection block with threshold preset to 2.0V. Contains a multi-stage voltage detector main core, a glitch filter, and a level shifter to translate signal domains safely.",
                role: "Substrate isolation using deep guard-rings. Implemented routing shields using Metal 1 & Metal 3 connected to VSS to protect sensitive threshold lines.",
                graphics: `
                    <svg viewBox="0 0 400 240" width="100%" height="100%">
                        <rect width="100%" height="100%" fill="none" stroke="var(--metal2)" stroke-width="2" class="layer-metal2"/>
                        
                        <!-- Detector Main -->
                        <g class="drill-cell" data-goto="detector_main" transform="translate(20, 50)">
                            <rect width="100" height="140" fill="var(--pwell-solid)" stroke="var(--metal1)" stroke-width="1.5" class="layer-metal1"/>
                            <text x="50" y="75" text-anchor="middle" fill="#FFFFFF" font-size="9" font-family="monospace">DETECTOR_MAIN</text>
                            <text x="50" y="95" text-anchor="middle" fill="var(--metal1)" font-size="8" font-family="monospace">Threshold Core</text>
                        </g>

                        <!-- Glitch Detector -->
                        <g class="drill-cell" data-goto="glitch_detector" transform="translate(150, 50)">
                            <rect width="100" height="140" fill="var(--pwell-solid)" stroke="var(--metal1)" stroke-width="1.5" class="layer-metal1"/>
                            <text x="50" y="75" text-anchor="middle" fill="#FFFFFF" font-size="9" font-family="monospace">GLITCH_DET</text>
                            <text x="50" y="95" text-anchor="middle" fill="var(--metal1)" font-size="8" font-family="monospace">RC Filter Core</text>
                        </g>

                        <!-- Level Shifter -->
                        <g class="drill-cell" data-goto="level_shifter" transform="translate(280, 50)">
                            <rect width="100" height="140" fill="var(--pwell-solid)" stroke="var(--metal1)" stroke-width="1.5" class="layer-metal1"/>
                            <text x="50" y="75" text-anchor="middle" fill="#FFFFFF" font-size="9" font-family="monospace">LVL_SHIFTER</text>
                            <text x="50" y="95" text-anchor="middle" fill="var(--metal1)" font-size="8" font-family="monospace">IO Buffer Domain</text>
                        </g>

                        <path d="M 120 120 L 150 120" stroke="var(--metal3)" stroke-width="3" class="layer-metal3"/>
                        <path d="M 250 120 L 280 120" stroke="var(--metal3)" stroke-width="3" class="layer-metal3"/>
                    </svg>
                `
            },
            vd_4v: {
                title: "Voltage Detector 4V Block",
                scale: "2.5X SCALE",
                props: {
                    "Cell Name": "voltage_detector_4v",
                    "Hierarchy Parent": "voltage_detector_top",
                    "Silicon Area": "70 um x 110 um",
                    "Voltage Threshold": "4.0 V",
                    "Shielding": "Guard Rings"
                },
                specs: "A dedicated detection block with threshold preset to 4.0V. Contains a multi-stage voltage detector main core, a glitch filter, and a level shifter to translate signal domains safely.",
                role: "Substrate isolation using deep guard-rings. Implemented routing shields using Metal 1 & Metal 3 connected to VSS to protect sensitive threshold lines.",
                graphics: `
                    <svg viewBox="0 0 400 240" width="100%" height="100%">
                        <rect width="100%" height="100%" fill="none" stroke="var(--metal2)" stroke-width="2" class="layer-metal2"/>
                        <g class="drill-cell" data-goto="detector_main" transform="translate(20, 50)">
                            <rect width="100" height="140" fill="var(--pwell-solid)" stroke="var(--metal1)" stroke-width="1.5" class="layer-metal1"/>
                            <text x="50" y="75" text-anchor="middle" fill="#FFFFFF" font-size="9" font-family="monospace">DETECTOR_MAIN</text>
                            <text x="50" y="95" text-anchor="middle" fill="var(--metal1)" font-size="8" font-family="monospace">Threshold Core</text>
                        </g>
                        <g class="drill-cell" data-goto="glitch_detector" transform="translate(150, 50)">
                            <rect width="100" height="140" fill="var(--pwell-solid)" stroke="var(--metal1)" stroke-width="1.5" class="layer-metal1"/>
                            <text x="50" y="75" text-anchor="middle" fill="#FFFFFF" font-size="9" font-family="monospace">GLITCH_DET</text>
                            <text x="50" y="95" text-anchor="middle" fill="var(--metal1)" font-size="8" font-family="monospace">RC Filter Core</text>
                        </g>
                        <g class="drill-cell" data-goto="level_shifter" transform="translate(280, 50)">
                            <rect width="100" height="140" fill="var(--pwell-solid)" stroke="var(--metal1)" stroke-width="1.5" class="layer-metal1"/>
                            <text x="50" y="75" text-anchor="middle" fill="#FFFFFF" font-size="9" font-family="monospace">LVL_SHIFTER</text>
                            <text x="50" y="95" text-anchor="middle" fill="var(--metal1)" font-size="8" font-family="monospace">IO Buffer Domain</text>
                        </g>
                        <path d="M 120 120 L 150 120" stroke="var(--metal3)" stroke-width="3" class="layer-metal3"/>
                        <path d="M 250 120 L 280 120" stroke="var(--metal3)" stroke-width="3" class="layer-metal3"/>
                    </svg>
                `
            },
            vd_7v: {
                title: "Voltage Detector 7V Block",
                scale: "2.5X SCALE",
                props: {
                    "Cell Name": "voltage_detector_7v",
                    "Hierarchy Parent": "voltage_detector_top",
                    "Silicon Area": "70 um x 110 um",
                    "Voltage Threshold": "7.0 V",
                    "Shielding": "Guard Rings"
                },
                specs: "A dedicated detection block with threshold preset to 7.0V. Contains a multi-stage voltage detector main core, a glitch filter, and a level shifter to translate signal domains safely.",
                role: "Substrate isolation using deep guard-rings. Implemented routing shields using Metal 1 & Metal 3 connected to VSS to protect sensitive threshold lines.",
                graphics: `
                    <svg viewBox="0 0 400 240" width="100%" height="100%">
                        <rect width="100%" height="100%" fill="none" stroke="var(--metal2)" stroke-width="2" class="layer-metal2"/>
                        <g class="drill-cell" data-goto="detector_main" transform="translate(20, 50)">
                            <rect width="100" height="140" fill="var(--pwell-solid)" stroke="var(--metal1)" stroke-width="1.5" class="layer-metal1"/>
                            <text x="50" y="75" text-anchor="middle" fill="#FFFFFF" font-size="9" font-family="monospace">DETECTOR_MAIN</text>
                            <text x="50" y="95" text-anchor="middle" fill="var(--metal1)" font-size="8" font-family="monospace">Threshold Core</text>
                        </g>
                        <g class="drill-cell" data-goto="glitch_detector" transform="translate(150, 50)">
                            <rect width="100" height="140" fill="var(--pwell-solid)" stroke="var(--metal1)" stroke-width="1.5" class="layer-metal1"/>
                            <text x="50" y="75" text-anchor="middle" fill="#FFFFFF" font-size="9" font-family="monospace">GLITCH_DET</text>
                            <text x="50" y="95" text-anchor="middle" fill="var(--metal1)" font-size="8" font-family="monospace">RC Filter Core</text>
                        </g>
                        <g class="drill-cell" data-goto="level_shifter" transform="translate(280, 50)">
                            <rect width="100" height="140" fill="var(--pwell-solid)" stroke="var(--metal1)" stroke-width="1.5" class="layer-metal1"/>
                            <text x="50" y="75" text-anchor="middle" fill="#FFFFFF" font-size="9" font-family="monospace">LVL_SHIFTER</text>
                            <text x="50" y="95" text-anchor="middle" fill="var(--metal1)" font-size="8" font-family="monospace">IO Buffer Domain</text>
                        </g>
                        <path d="M 120 120 L 150 120" stroke="var(--metal3)" stroke-width="3" class="layer-metal3"/>
                        <path d="M 250 120 L 280 120" stroke="var(--metal3)" stroke-width="3" class="layer-metal3"/>
                    </svg>
                `
            },
            detector_main: {
                title: "Detector Main Block Core",
                scale: "6X SCALE",
                props: {
                    "Cell Name": "detector_main_core",
                    "Hierarchy Parent": "voltage_detector_Xv",
                    "Silicon Area": "25 um x 45 um",
                    "Input Parasitics": "< 5 fF"
                },
                specs: "The main analog core of the voltage detector. Contains an RC Filter cell to smooth high-frequency line spikes, an analog comparator to detect threshold crossings, and a Schmitt trigger cell to prevent oscillation near the threshold.",
                role: "Common-centroid matched transistor layout for the comparator input differential pair. Implemented interdigitated resistors with dummy structures in the RC filter for precise matching.",
                graphics: `
                    <svg viewBox="0 0 400 240" width="100%" height="100%">
                        <rect width="100%" height="100%" fill="none" stroke="var(--metal1)" stroke-width="2" class="layer-metal1"/>
                        
                        <!-- RC Filter cell -->
                        <g class="drill-cell" data-goto="rc_filter" transform="translate(15, 60)">
                            <rect width="100" height="120" fill="var(--pwell-solid)" stroke="var(--poly)" stroke-width="1.5" class="layer-poly"/>
                            <text x="50" y="65" text-anchor="middle" fill="#FFFFFF" font-size="8" font-family="monospace">RC_FILTER</text>
                            <path d="M 20 85 L 80 85 L 80 95 L 20 95 L 20 105 L 80 105" stroke="var(--poly)" stroke-width="4" fill="none" class="layer-poly"/>
                        </g>

                        <!-- Comparator cell -->
                        <g class="drill-cell" data-goto="comparator" transform="translate(145, 60)">
                            <rect width="110" height="120" fill="var(--pwell-solid)" stroke="var(--poly)" stroke-width="1.5" class="layer-poly"/>
                            <text x="55" y="65" text-anchor="middle" fill="#FFFFFF" font-size="8" font-family="monospace">COMPARATOR</text>
                            <polygon points="35,80 75,100 35,120" fill="var(--metal1-solid)" stroke="var(--metal1)" stroke-width="2" class="layer-metal1"/>
                        </g>

                        <!-- Schmitt Trigger cell -->
                        <g class="drill-cell" data-goto="schmitt_trigger" transform="translate(280, 60)">
                            <rect width="105" height="120" fill="var(--pwell-solid)" stroke="var(--poly)" stroke-width="1.5" class="layer-poly"/>
                            <text x="52" y="65" text-anchor="middle" fill="#FFFFFF" font-size="8" font-family="monospace">SCHMITT_TRIG</text>
                            <path d="M 35 110 L 55 110 L 55 90 L 75 90 M 50 110 L 50 90 M 60 110 L 60 90" stroke="var(--metal2)" stroke-width="2" fill="none" class="layer-metal2"/>
                        </g>
                        
                        <path d="M 115 120 L 145 120" stroke="var(--metal2)" stroke-width="2" class="layer-metal2"/>
                        <path d="M 255 120 L 280 120" stroke="var(--metal2)" stroke-width="2" class="layer-metal2"/>
                    </svg>
                `
            },
            rc_filter: {
                title: "RC Filter Cell Layout",
                scale: "12X SCALE",
                props: { "Cell Name": "rc_filter_cell", "R Value": "2.4 kOhm", "C Value": "1.2 pF" },
                specs: "Analog RC low pass filter cell to suppress brief high-voltage spikes on the sensing node before it reaches the comparator input gates.",
                role: "Constructed the resistor using high-resistivity polysilicon layers (OPC orchard layer) running in interdigitated rows with dummy stripes at the edges. Capacitors built as Metal-Insulator-Metal (MIM) layers overlaying the resistor banks.",
                graphics: `
                    <svg viewBox="0 0 400 240" width="100%" height="100%">
                        <rect width="100%" height="100%" fill="none" stroke="var(--poly)" stroke-width="2" class="layer-poly"/>
                        <path d="M 30 70 L 370 70 L 370 100 L 30 100 L 30 130 L 370 130 L 370 160 L 30 160" stroke="var(--poly)" stroke-width="12" fill="none" class="layer-poly"/>
                        <text x="200" y="210" text-anchor="middle" fill="var(--poly)" font-size="10" font-family="monospace">Poly Resistor Serpentines</text>
                    </svg>
                `
            },
            comparator: {
                title: "Analog Comparator Cell Layout",
                scale: "12X SCALE",
                props: { "Cell Name": "comparator_cell", "Common Mode Range": "0.2V - 1.6V", "Offset Skew": "< 1.5 mV" },
                specs: "High-precision analog differential comparator matching the sensed filter voltage against internal bandgap references.",
                role: "Common-centroid matched layout (ABBA pattern) for differential input transistors to cancel out thermal and process gradients. Routing executed with cross-coupling wiring in Metal 1 and Metal 2 to keep symmetrical parasitic loads.",
                graphics: `
                    <svg viewBox="0 0 400 240" width="100%" height="100%">
                        <rect width="100%" height="100%" fill="none" stroke="var(--poly)" stroke-width="2" class="layer-poly"/>
                        <rect x="40" y="50" width="140" height="140" fill="var(--nwell-solid)" opacity="0.4" stroke="var(--nwell)" stroke-width="1" class="layer-nwell"/>
                        <rect x="220" y="50" width="140" height="140" fill="var(--nwell-solid)" opacity="0.4" stroke="var(--nwell)" stroke-width="1" class="layer-nwell"/>
                        
                        <line x1="70" y1="60" x2="70" y2="180" stroke="var(--poly)" stroke-width="8" class="layer-poly"/>
                        <line x1="110" y1="60" x2="110" y2="180" stroke="var(--poly)" stroke-width="8" class="layer-poly"/>
                        <line x1="150" y1="60" x2="150" y2="180" stroke="var(--poly)" stroke-width="8" class="layer-poly"/>
                        
                        <line x1="250" y1="60" x2="250" y2="180" stroke="var(--poly)" stroke-width="8" class="layer-poly"/>
                        <line x1="290" y1="60" x2="290" y2="180" stroke="var(--poly)" stroke-width="8" class="layer-poly"/>
                        <line x1="330" y1="60" x2="330" y2="180" stroke="var(--poly)" stroke-width="8" class="layer-poly"/>
                        
                        <text x="200" y="210" text-anchor="middle" fill="var(--text-accent)" font-size="10" font-family="monospace">Common-Centroid Input Pairs (A-B-B-A)</text>
                    </svg>
                `
            },
            schmitt_trigger: {
                title: "Schmitt Trigger Cell Layout",
                scale: "12X SCALE",
                props: { "Cell Name": "schmitt_trigger_cell", "Hysteresis Width": "150 mV", "Output Buffer Drive": "4 mA" },
                specs: "Digital Schmitt trigger cell providing clean high-speed threshold transition with noise immunity and sharp rising/falling signal edges.",
                role: "Optimized width ratios of PMOS feedback paths. Symmetrical design and short routes in Metal 1 and Metal 2 to reduce propagation delay.",
                graphics: `
                    <svg viewBox="0 0 400 240" width="100%" height="100%">
                        <rect width="100%" height="100%" fill="none" stroke="var(--poly)" stroke-width="2" class="layer-poly"/>
                        <rect x="50" y="60" width="300" height="120" fill="var(--pwell-solid)" stroke="var(--metal1)" stroke-width="1.5" class="layer-metal1"/>
                        <path d="M 80 120 L 160 120 L 160 80 L 240 80 L 240 160 L 320 160" stroke="var(--metal2)" stroke-width="5" fill="none" class="layer-metal2"/>
                        <rect x="157" y="117" width="6" height="6" fill="var(--via)" class="layer-via"/>
                        <rect x="237" y="77" width="6" height="6" fill="var(--via)" class="layer-via"/>
                        <text x="200" y="210" text-anchor="middle" fill="var(--metal2)" font-size="10" font-family="monospace">Hysteresis Logic Cell</text>
                    </svg>
                `
            },
            glitch_detector: {
                title: "Glitch Detector Filter Block",
                scale: "4X SCALE",
                props: { "Cell Name": "glitch_filter", "Pulse Width Rejection": "< 12 ns", "Silicon Area": "22 um x 35 um" },
                specs: "RC delay glitch filter block to suppress noise spikes on detection signals, verifying stable state transitions before routing to outputs.",
                role: "Floorplanned as a compact array adjacent to the main comparator. Utilized Metal 1 shield paths covering the digital nodes.",
                graphics: `
                    <svg viewBox="0 0 400 240" width="100%" height="100%">
                        <rect width="100%" height="100%" fill="none" stroke="var(--metal1)" stroke-width="2" class="layer-metal1"/>
                        <rect x="50" y="50" width="300" height="140" fill="var(--nwell-solid)" opacity="0.4" stroke="var(--nwell)" stroke-width="2" class="layer-nwell"/>
                        <path d="M 80 80 L 320 80 M 80 120 L 320 120 M 80 160 L 320 160" stroke="var(--poly)" stroke-width="6" fill="none" class="layer-poly"/>
                        <text x="200" y="215" text-anchor="middle" fill="var(--text-secondary)" font-size="10" font-family="monospace">Glitch Filter Cell Logic Gate Matrix</text>
                    </svg>
                `
            },
            level_shifter: {
                title: "Level Shifter Domain Block",
                scale: "4X SCALE",
                props: { "Cell Name": "lvl_shifter_cell", "Input Voltage Domain": "1.8 V (Core)", "Output Voltage Domain": "5.0 V (I/O)", "Silicon Area": "28 um x 40 um" },
                specs: "Translates low-voltage detection signals from the internal analog core into 5V logic signals for the external pad isolation boundary.",
                role: "Ensured sufficient separation distances between low-voltage (1.8V) and high-voltage (5V) active regions. Structured concentric N-well guards to contain substrate noise.",
                graphics: `
                    <svg viewBox="0 0 400 240" width="100%" height="100%">
                        <rect width="100%" height="100%" fill="none" stroke="var(--metal1)" stroke-width="2" class="layer-metal1"/>
                        <rect x="30" y="40" width="150" height="160" fill="var(--pwell-solid)" opacity="0.3" stroke="var(--pwell)" stroke-width="1" class="layer-pwell"/>
                        <rect x="220" y="40" width="150" height="160" fill="var(--nwell-solid)" opacity="0.45" stroke="var(--nwell)" stroke-width="1.5" class="layer-nwell"/>
                        
                        <text x="105" y="70" text-anchor="middle" fill="#60A5FA" font-size="9" font-family="monospace">1.8V Domain</text>
                        <text x="295" y="70" text-anchor="middle" fill="#F472B6" font-size="9" font-family="monospace">5.0V Domain</text>
                        
                        <path d="M 120 120 L 280 120" stroke="var(--metal2)" stroke-width="5" fill="none" class="layer-metal2"/>
                        <rect x="195" y="115" width="10" height="10" fill="var(--via)" class="layer-via"/>
                        
                        <text x="200" y="220" text-anchor="middle" fill="#FFFFFF" font-size="10" font-family="monospace">Dual-Well Voltage Boundary</text>
                    </svg>
                `
            }
        }
    },
    
    motor_driver: {
        title: "Motor Driver IP",
        process: "65nm LBC10",
        levels: {
            top: {
                title: "Motor Driver IP [Top Level]",
                scale: "1X SCALE",
                props: {
                    "Cell Name": "motor_driver_top",
                    "Process Node": "65nm LBC10",
                    "Supply Voltage": "12.0 V / 3.3 V",
                    "Silicon Area": "380 um x 220 um",
                    "Isolation Type": "DT (Deep Trench) Guard"
                },
                specs: "Silicon IPs designed for high-current motor driver chips. Built on 65nm LBC10 technology, integrating precision parasitics control, resistor matching, and Deep Trench Isolation (DT) around critical analog blocks to prevent substrate noise coupling.",
                role: "Performed floorplanning of current mirrors and driving arrays, optimized routing width to carry peak currents, and routed a complete Deep Trench Isolation guard ring around sensitive circuitry.",
                graphics: `
                    <svg viewBox="0 0 400 240" width="100%" height="100%">
                        <rect width="100%" height="100%" fill="none" stroke="var(--dt)" stroke-width="2" class="layer-dt" stroke-dasharray="8,4"/>
                        
                        <!-- Deep Trench Isolation Guard -->
                        <rect x="250" y="30" width="130" height="180" rx="4" fill="none" stroke="var(--dt)" stroke-width="5" stroke-dasharray="10, 5" class="layer-dt"/>
                        <text x="315" y="25" text-anchor="middle" fill="var(--dt)" font-size="8" font-family="monospace">DT ISOLATION GUARD</text>
 
                        <!-- BJT Bandgap Block -->
                        <g class="drill-cell" data-goto="bandgap" transform="translate(20, 40)">
                            <rect width="100" height="160" rx="3" fill="var(--nwell-solid)" stroke="var(--metal2)" stroke-width="1.5" class="layer-metal2"/>
                            <text x="50" y="70" text-anchor="middle" fill="#FFFFFF" font-size="9" font-family="monospace">BJT_BANDGAP</text>
                            <text x="50" y="90" text-anchor="middle" fill="var(--text-secondary)" font-size="8" font-family="monospace">65nm Core</text>
                        </g>
 
                        <!-- Resistor Matching Arrays -->
                        <g class="drill-cell" data-goto="res_matching" transform="translate(135, 40)">
                            <rect width="100" height="160" rx="3" fill="var(--pwell-solid)" stroke="var(--metal2)" stroke-width="1.5" class="layer-metal2"/>
                            <text x="50" y="70" text-anchor="middle" fill="#FFFFFF" font-size="9" font-family="monospace">RES_ARRAY</text>
                            <text x="50" y="90" text-anchor="middle" fill="var(--text-secondary)" font-size="8" font-family="monospace">Matched Pair</text>
                        </g>
 
                        <!-- Other Block (DT Isolated) -->
                        <g class="drill-cell" data-goto="dt_block" transform="translate(265, 45)">
                            <rect width="100" height="150" rx="3" fill="rgba(30,15,40,0.5)" stroke="var(--dt)" stroke-width="2.5" class="layer-dt"/>
                            <text x="50" y="70" text-anchor="middle" fill="#FFFFFF" font-size="9" font-family="monospace">ISOLATED_CELL</text>
                            <text x="50" y="90" text-anchor="middle" fill="var(--dt)" font-size="8" font-family="monospace">Sensitive IP</text>
                        </g>
                    </svg>
                `
            },
            bandgap: {
                title: "BJT Bandgap Power Block Core",
                scale: "3X SCALE",
                props: { "Cell Name": "bjt_bandgap_65nm", "Temperature Drift": "< 12 ppm/C", "Output Reference": "1.20 V" },
                specs: "High-precision reference voltage source utilizing matched BJT transistors. Essential for motor drivers to maintain stable reference bias voltage under heat shifts.",
                role: "Laid out BJTs in a tight common-centroid matrix (e.g. 3x3 array) with dummy elements. Routed emitter/base tracks with strict symmetry. Matched parasitic resistance in metal routes.",
                graphics: `
                    <svg viewBox="0 0 400 240" width="100%" height="100%">
                        <rect width="100%" height="100%" fill="none" stroke="var(--metal2)" stroke-width="2" class="layer-metal2"/>
                        <g transform="translate(50, 40)">
                            <circle cx="50" cy="50" r="25" fill="var(--pwell-solid)" stroke="var(--poly)" stroke-width="2.5" class="layer-poly"/>
                            <circle cx="150" cy="50" r="25" fill="var(--pwell-solid)" stroke="var(--poly)" stroke-width="2.5" class="layer-poly"/>
                            <circle cx="250" cy="50" r="25" fill="var(--pwell-solid)" stroke="var(--poly)" stroke-width="2.5" class="layer-poly"/>
                            <circle cx="50" cy="120" r="25" fill="var(--pwell-solid)" stroke="var(--poly)" stroke-width="2.5" class="layer-poly"/>
                            <circle cx="150" cy="120" r="25" fill="var(--pwell-solid)" stroke="var(--poly)" stroke-width="2.5" class="layer-poly"/>
                            <circle cx="250" cy="120" r="25" fill="var(--pwell-solid)" stroke="var(--poly)" stroke-width="2.5" class="layer-poly"/>
                            
                            <text x="50" y="55" text-anchor="middle" fill="#FFFFFF" font-size="10" font-family="monospace">Q1</text>
                            <text x="150" y="55" text-anchor="middle" fill="#FFFFFF" font-size="10" font-family="monospace">Q2</text>
                            <text x="250" y="55" text-anchor="middle" fill="#FFFFFF" font-size="10" font-family="monospace">Q3</text>
                            <text x="50" y="125" text-anchor="middle" fill="#FFFFFF" font-size="10" font-family="monospace">Q4</text>
                            <text x="150" y="125" text-anchor="middle" fill="#FFFFFF" font-size="10" font-family="monospace">Q5</text>
                            <text x="250" y="125" text-anchor="middle" fill="#FFFFFF" font-size="10" font-family="monospace">Q6</text>
                        </g>
                    </svg>
                `
            },
            res_matching: {
                title: "Resistor Matching Arrays",
                scale: "3X SCALE",
                props: { "Cell Name": "matched_res_array", "Matching Precision": "0.1%", "Resistor Layer": "PPlus Poly" },
                specs: "Matched resistor arrays for the motor driver bias network, optimizing control to reduce feedback errors and output current mismatches.",
                role: "Arranged resistors with common-centroid patterns, routing interconnections horizontally using Metal 1 and vertically using Metal 2 with identical contact counts.",
                graphics: `
                    <svg viewBox="0 0 400 240" width="100%" height="100%">
                        <rect width="100%" height="100%" fill="none" stroke="var(--metal2)" stroke-width="2" class="layer-metal2"/>
                        <g transform="translate(60, 45)">
                            <rect x="0" y="10" width="280" height="12" fill="var(--poly)" class="layer-poly"/>
                            <rect x="0" y="35" width="280" height="12" fill="var(--poly)" class="layer-poly"/>
                            <rect x="0" y="60" width="280" height="12" fill="var(--poly)" class="layer-poly"/>
                            <rect x="0" y="85" width="280" height="12" fill="var(--poly)" class="layer-poly"/>
                            <rect x="0" y="110" width="280" height="12" fill="var(--poly)" class="layer-poly"/>
                            <rect x="0" y="135" width="280" height="12" fill="var(--poly)" class="layer-poly"/>
                            
                            <rect x="0" y="10" width="10" height="12" fill="var(--contact)" class="layer-contact"/>
                            <rect x="270" y="10" width="10" height="12" fill="var(--contact)" class="layer-contact"/>
                        </g>
                        <text x="200" y="215" text-anchor="middle" fill="var(--text-secondary)" font-size="10" font-family="monospace">Matched Array with Dummy Strips</text>
                    </svg>
                `
            },
            dt_block: {
                title: "Deep Trench Isolated Sensitive Block",
                scale: "3X SCALE",
                props: { "Cell Name": "isolated_analog_core", "Substrate Noise Rejection": "> 45 dB", "DT Depth": "6.5 um" },
                specs: "Sensitive low-noise analog block surrounded by a Deep Trench (DT) isolation loop. Prevents parasitic switching noise from high-current motor drivers from degrading output signal accuracy.",
                role: "Ensured a continuous, closed DT ring structure around the block with no routing gaps. Power connections routed in Metal 3 crossing the trench at right angles to minimize coupling.",
                graphics: `
                    <svg viewBox="0 0 400 240" width="100%" height="100%">
                        <rect width="100%" height="100%" fill="none" stroke="var(--dt)" stroke-width="2" class="layer-dt"/>
                        <rect x="40" y="30" width="320" height="175" rx="10" fill="none" stroke="var(--dt)" stroke-width="6" stroke-dasharray="14,7" class="layer-dt"/>
                        <text x="200" y="25" text-anchor="middle" fill="var(--dt)" font-size="10" font-family="monospace">DEEP TRENCH (DT) ISOLATION WALL</text>
                        
                        <rect x="80" y="70" width="240" height="100" fill="var(--pwell-solid)" stroke="var(--metal1)" stroke-width="1.5" class="layer-metal1"/>
                        <circle cx="200" cy="120" r="20" fill="none" stroke="var(--metal2)" stroke-width="3.5" class="layer-metal2"/>
                        <text x="200" y="125" text-anchor="middle" fill="#FFFFFF" font-size="9" font-family="monospace">ANALOG CORE</text>
                    </svg>
                `
            }
        }
    },
    
    translation_chip: {
        title: "Translation Chip Main Test Block",
        process: "130nm LBC7-PLV",
        levels: {
            top: {
                title: "Translation Chip Main Test Block [Top Level]",
                scale: "1X SCALE",
                props: {
                    "Cell Name": "translation_test_block",
                    "Process Node": "130nm LBC7-PLV",
                    "Supply Voltage": "5.0 V / 3.3 V",
                    "Silicon Area": "260 um x 180 um",
                    "Deep Trench": "None (DT-Less Process)"
                },
                specs: "High-voltage translation device featuring multiple ESD Clamps and N-Well Isolation. Fabricated on a DT-less process, relying on N-well guard rings to isolate power stages.",
                role: "Configured ESD cell layout with optimized metal width to carry peak surge currents. Structured concentric N-well guards to contain substrate noise.",
                graphics: `
                    <svg viewBox="0 0 400 240" width="100%" height="100%">
                        <rect width="100%" height="100%" fill="none" stroke="var(--pwell)" stroke-width="2" class="layer-pwell"/>
                        
                        <g class="drill-cell" data-goto="esd_clamps" transform="translate(30, 45)">
                            <rect width="160" height="150" rx="4" fill="var(--pwell-solid)" stroke="var(--metal2)" stroke-width="1.5" class="layer-metal2"/>
                            <text x="80" y="65" text-anchor="middle" fill="#FFFFFF" font-size="10" font-family="monospace">ESD_CLAMPS_CELL</text>
                            <rect x="25" y="110" width="30" height="25" fill="var(--metal3)" class="layer-metal3"/>
                            <rect x="65" y="110" width="30" height="25" fill="var(--metal3)" class="layer-metal3"/>
                            <rect x="105" y="110" width="30" height="25" fill="var(--metal3)" class="layer-metal3"/>
                        </g>
 
                        <g class="drill-cell" data-goto="nwell_isol" transform="translate(210, 45)">
                            <rect width="160" height="150" rx="4" fill="var(--pwell-solid)" stroke="var(--metal2)" stroke-width="1.5" class="layer-metal2"/>
                            <text x="80" y="65" text-anchor="middle" fill="#FFFFFF" font-size="10" font-family="monospace">NWELL_ISOLATION</text>
                            <rect x="25" y="105" width="110" height="35" fill="none" stroke="var(--nwell)" stroke-width="6" class="layer-nwell"/>
                        </g>
                    </svg>
                `
            },
            esd_clamps: {
                title: "ESD Clamp Array Details",
                scale: "3X SCALE",
                props: { "Cell Name": "esd_clamp_array", "ESD Protection Level": "> 2 kV HBM", "Silicon Area": "120 um x 80 um" },
                specs: "Array of electrostatic discharge (ESD) clamps positioned along the output pad boundaries to protect core gates from static shock damage.",
                role: "Laid out thick-oxide protection transistors with wide gate channels. Implemented massive metal contact vias (orange) to prevent electromigration during current discharge.",
                graphics: `
                    <svg viewBox="0 0 400 240" width="100%" height="100%">
                        <rect width="100%" height="100%" fill="none" stroke="var(--metal2)" stroke-width="2" class="layer-metal2"/>
                        <g transform="translate(30, 40)">
                            <rect x="10" y="20" width="80" height="120" fill="var(--nwell-solid)" opacity="0.35" stroke="var(--nwell)" stroke-width="1" class="layer-nwell"/>
                            <rect x="25" y="10" width="50" height="140" fill="none" stroke="var(--metal3)" stroke-width="4.5" class="layer-metal3"/>
                            
                            <rect x="130" y="20" width="80" height="120" fill="var(--nwell-solid)" opacity="0.35" stroke="var(--nwell)" stroke-width="1" class="layer-nwell"/>
                            <rect x="145" y="10" width="50" height="140" fill="none" stroke="var(--metal3)" stroke-width="4.5" class="layer-metal3"/>
 
                            <rect x="250" y="20" width="80" height="120" fill="var(--nwell-solid)" opacity="0.35" stroke="var(--nwell)" stroke-width="1" class="layer-nwell"/>
                            <rect x="265" y="10" width="50" height="140" fill="none" stroke="var(--metal3)" stroke-width="4.5" class="layer-metal3"/>
                        </g>
                        <text x="200" y="215" text-anchor="middle" fill="var(--metal3)" font-size="10" font-family="monospace">Concentric ESD Protection Bars</text>
                    </svg>
                `
            },
            nwell_isol: {
                title: "N-Well Isolation Guard Ring",
                scale: "3X SCALE",
                props: { "Cell Name": "nwell_guard_ring", "Substrate Doping": "P-Substrate", "Isolation Level": "Standard Guard Ring" },
                specs: "N-Well isolation guard ring designed to block substrate carrier leakage on a DT-less silicon process. Serves as a primary barrier to isolate signal core from pad drive switches.",
                role: "Ensured maximum N-Well width and added dense contact strips (Metal 1 green to active n-diffusion pink) tied directly to the positive supply line to collect drift carriers.",
                graphics: `
                    <svg viewBox="0 0 400 240" width="100%" height="100%">
                        <rect width="100%" height="100%" fill="none" stroke="var(--metal2)" stroke-width="2" class="layer-metal2"/>
                        <rect x="30" y="30" width="340" height="150" fill="none" stroke="var(--nwell)" stroke-width="16" class="layer-nwell"/>
                        <rect x="38" y="38" width="324" height="134" fill="none" stroke="var(--metal1)" stroke-width="6" class="layer-metal1"/>
                        <rect x="35" y="35" width="6" height="6" fill="var(--contact)" class="layer-contact"/>
                        <rect x="359" y="35" width="6" height="6" fill="var(--contact)" class="layer-contact"/>
                        <text x="200" y="210" text-anchor="middle" fill="var(--nwell)" font-size="10" font-family="monospace">N-Well Guard Ring Loop (Vclip = VDD)</text>
                    </svg>
                `
            }
        }
    },
    
    // --- SKILL SCRIPT SIMULATORS ---
    router_sim: {
        title: "SKILL Digital Core Autorouter",
        process: "SKILL Script",
        levels: {
            top: {
                title: "SKILL Autorouter Tool Simulator",
                scale: "CAD AUTOMATION",
                props: {
                    "Tool Name": "digital_core_autoroute.il",
                    "Language": "Cadence SKILL",
                    "Target Block": "Digital Logic Core Block",
                    "DRC Engine": "Assura DRC Integrated"
                },
                specs: "Automation routing script written in SKILL for routing connections strictly inside a digital core block. The digital core block contains standard cells, internal signal pins, and pad pins from surrounding IO buffers — the autorouter connects all of these together internally. It does NOT route between the input buffer block and output buffer block themselves; those inter-block connections are handled by top-level routing. The tool automatically resolves optimal paths, handles layer intersections, and inserts vias — all confined inside the digital block boundary.",
                role: "Developed the core path search routing algorithm, layer constraint mapping (Metal 1 for horizontal runs, Metal 2 for vertical runs), and automated via insertion logic. The router respects existing pin locations from IO buffer pads feeding into the digital core.",
                graphics: "" // Rendered via separate DOM panel inside HTML
            }
        }
    },
    
    atop_sim: {
        title: "ATOP Parasitics Analyzer",
        process: "SKILL Script",
        levels: {
            top: {
                title: "ATOP (Top Level Parasitics Extractor)",
                scale: "CAD AUTOMATION",
                props: {
                    "Tool Name": "atop_parasitics_analyzer.il",
                    "Methodology": "XOR Top vs Block Comparison",
                    "Extraction Layer": "RC Parasitic Mesh",
                    "Extraction Speedup": "~40% Reduction"
                },
                specs: "Standard extraction flows analyze blocks in complete isolation or at the full top-level. ATOP runs parasitic extraction on individual blocks while incorporating top-level metal tracks passing directly above. It executes a logical XOR comparison between top-level layout routing and the block layout to extract and include top-level metal overlaps into the block's parasitic netlist.",
                role: "Created the layout comparison script utilizing Virtuoso DB queries, layer boolean XOR APIs, and parasitic coupling capacitance calculations.",
                graphics: ""
            }
        }
    },
    
    pathbuf_sim: {
        title: "Pathbuffer Delay Analyzer",
        process: "SKILL Script",
        levels: {
            top: {
                title: "Pathbuffer Delay & Cap Analyzer",
                scale: "CAD AUTOMATION",
                props: {
                    "Tool Name": "pathbuffer_analyzer.il",
                    "Input Parameter": "Load Capacitance (Cload)",
                    "Threshold Limit": "25.0 fF",
                    "Output Result": "Buffer Status & Delay"
                },
                specs: "Analyzes signal path interconnects inside high-speed layouts. Checks input load capacitance against design rules. If the load capacitance exceeds the threshold limit, it marks a path buffer as REQUIRED, logs delay skew details, and suggests optimized cell sizing.",
                role: "Implemented the capacitance lookup routines, threshold comparator loop, and delay calculation models based on node widths and lengths.",
                graphics: ""
            }
        }
    }
};

// ==================== DOM QUERY SELECTORS ====================

const DOM = {
    canvasContainer: document.getElementById('canvas-container'),
    viewport: document.getElementById('viewport'),
    siliconChip: document.getElementById('silicon-chip'),
    overlayContainer: document.getElementById('overlay-container'),
    closeOverlayBtn: document.getElementById('close-overlay-btn'),
    cellDisplayHUD: document.getElementById('cell-name-display'),
    
    // Project Explorer & Drilldown
    projectsGrid: document.getElementById('projects-top-grid'),
    drilldownContainer: document.getElementById('drilldown-container'),
    drilldownBackBtn: document.getElementById('drilldown-back-btn'),
    drilldownCrumbs: document.getElementById('drilldown-crumbs'),
    cellTitle: document.getElementById('drilldown-cell-title'),
    cellScale: document.getElementById('drilldown-cell-scale'),
    drilldownGraphics: document.getElementById('drilldown-graphics'),
    drilldownProps: document.getElementById('drilldown-props'),
    drilldownSpecs: document.getElementById('drilldown-specs'),
    drilldownRole: document.getElementById('drilldown-role'),
    explorerHint: document.getElementById('explorer-top-hint'),
    
    // Script Simulators
    simulatorContainer: document.getElementById('simulator-container'),
    simulatorBackBtn: document.getElementById('simulator-back-btn'),
    simulatorCrumbs: document.getElementById('simulator-crumbs'),
    simCellTitle: document.getElementById('sim-cell-title'),
    simBtnRun: document.getElementById('btn-sim-run'),
    simBtnReset: document.getElementById('btn-sim-reset'),
    simConsoleLog: document.getElementById('sim-console-log'),
    simHudCardContent: document.getElementById('sim-hud-card-content'),
    capSlider: document.getElementById('cap-slider'),
    capValueDisplay: document.getElementById('cap-value-display')
};

// ==================== INITIALIZATION ====================

function initApp() {
    setupEventListeners();
    setupElectricalHierarchyHandlers();
}

function setupEventListeners() {
    // Zooming into top level chip blocks
    document.querySelectorAll('.chip-block').forEach(block => {
        block.addEventListener('click', (e) => {
            const blockId = block.id.replace('block-', '');
            zoomIntoBlock(blockId, block);
        });
    });

    // Close overlays
    DOM.closeOverlayBtn.addEventListener('click', zoomBackToTop);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && state.activeBlock) {
            zoomBackToTop();
        }
    });

    // Layout Explorer clicks (6 cards)
    document.querySelectorAll('.proj-explorer-card').forEach(card => {
        card.addEventListener('click', () => {
            const projId = card.getAttribute('data-project');
            initProject(projId);
        });
    });

    DOM.drilldownBackBtn.addEventListener('click', stepOutProjectHierarchy);
    DOM.simulatorBackBtn.addEventListener('click', exitActiveProject);
    
    // Simulator trigger buttons
    DOM.simBtnRun.addEventListener('click', runActiveSimulator);
    DOM.simBtnReset.addEventListener('click', resetActiveSimulator);
    
    // Capacitance slider change event
    if (DOM.capSlider) {
        DOM.capSlider.addEventListener('input', (e) => {
            state.pathbufCap = parseInt(e.target.value);
            DOM.capValueDisplay.innerText = state.pathbufCap + " fF";
            updatePathbufHUD();
        });
    }
}

// ==================== TIMED LOGGER HELPER ====================

function addLogLine(consoleElement, text, type = 'output', delay = 0) {
    setTimeout(() => {
        if (!consoleElement) return;
        const line = document.createElement('div');
        line.className = `term-line ${type}`;
        line.innerText = text;
        consoleElement.appendChild(line);
        consoleElement.scrollTop = consoleElement.scrollHeight;
    }, delay);
}

// ==================== TOP-LEVEL ORIGIN ZOOM & NAVIGATION ====================

function zoomIntoBlock(blockId, blockElement) {
    state.activeBlock = blockId;

    // Get block bounding box and translation coordinates dynamically
    const bbox = blockElement.getBBox();
    const transformAttr = blockElement.getAttribute('transform');
    const matches = transformAttr.match(/translate\(([\d.-]+),\s*([\d.-]+)\)/);
    const transX = matches ? parseFloat(matches[1]) : 0;
    const transY = matches ? parseFloat(matches[2]) : 0;
    
    // Compute SVG absolute center
    const blockCX = transX + bbox.width / 2;
    const blockCY = transY + bbox.height / 2;
    
    // Percentage translation origin coordinate relative to SVG viewbox (500 x 1300)
    const originX = (blockCX / 500) * 100;
    const originY = (blockCY / 1300) * 100;
    
    // Perform transform on the SVG directly
    DOM.siliconChip.style.transformOrigin = `${originX}% ${originY}%`;
    DOM.siliconChip.style.transform = "scale(3.5)";

    // Open overlay panel after transition
    setTimeout(() => {
        DOM.overlayContainer.classList.add('active');
        document.querySelectorAll('.overlay-content').forEach(c => c.classList.remove('active'));
        
        const targetContent = document.getElementById(`content-${blockId}`);
        if (targetContent) {
            targetContent.classList.add('active');
        }
        
        // Reset sub project explorer state if opening Layout Projects
        if (blockId === 'layout-projects') {
            exitActiveProject();
        }
        
        DOM.cellDisplayHUD.innerText = `${blockId.toUpperCase().replace('-', '_')}_CELL(layout)`;
    }, 350);
}

function zoomBackToTop() {
    state.activeBlock = null;
    DOM.overlayContainer.classList.remove('active');
    
    // Reset transform scale
    DOM.siliconChip.style.transform = "scale(1)";
    DOM.cellDisplayHUD.innerText = 'ganishvar_chip(layout)';
}

// ==================== UNIFIED PROJECTS EXPLORER ====================

function initProject(projId) {
    state.activeProject = projId;
    
    // Hide top grids
    DOM.projectsGrid.style.display = 'none';
    DOM.explorerHint.style.display = 'none';
    
    const isSkillSim = projId.includes('_sim');
    
    if (isSkillSim) {
        // Launch Script Simulator detail panel
        DOM.simulatorContainer.classList.remove('hidden');
        DOM.drilldownContainer.classList.add('hidden');
        
        setupActiveSimulatorView();
    } else {
        // Launch CAD Hierarchical Explorer
        DOM.drilldownContainer.classList.remove('hidden');
        DOM.simulatorContainer.classList.add('hidden');
        state.projectHierarchy = ['top'];
        
        renderActiveDrilldownNode();
    }
}

function exitActiveProject() {
    state.activeProject = null;
    state.projectHierarchy = [];
    
    DOM.drilldownContainer.classList.add('hidden');
    DOM.simulatorContainer.classList.add('hidden');
    
    DOM.projectsGrid.style.display = 'grid';
    DOM.explorerHint.style.display = 'block';
    
    DOM.cellDisplayHUD.innerText = `LAYOUT_PROJECTS_CELL(layout)`;
}

// ==================== CAD HIERARCHICAL DRILLDOWN ====================

function renderActiveDrilldownNode() {
    const proj = PROJECTS_DATA[state.activeProject];
    const currentNodeKey = state.projectHierarchy[state.projectHierarchy.length - 1];
    
    const node = proj.levels[currentNodeKey] || proj.levels['top'];
    
    // Update display labels
    DOM.cellTitle.innerText = `CELL: ${currentNodeKey.toUpperCase()}_CELL`;
    DOM.cellScale.innerText = node.scale;
    DOM.drilldownSpecs.innerText = node.specs;
    DOM.drilldownRole.innerText = node.role;
    
    // Populate properties table
    DOM.drilldownProps.innerHTML = '';
    for (const [key, val] of Object.entries(node.props)) {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${key}:</td><td>${val}</td>`;
        DOM.drilldownProps.appendChild(row);
    }
    
    // Inject custom SVG graphics
    DOM.drilldownGraphics.innerHTML = node.graphics;
    
    // Bind click events on injected subcell graphics
    DOM.drilldownGraphics.querySelectorAll('.drill-cell').forEach(cell => {
        cell.addEventListener('click', () => {
            const nextNodeKey = cell.getAttribute('data-goto');
            drillDownInto(nextNodeKey);
        });
    });
    
    // Update crumbs
    updateDrilldownCrumbs();
}

function drillDownInto(nodeKey) {
    state.projectHierarchy.push(nodeKey);
    renderActiveDrilldownNode();
}

function stepOutProjectHierarchy() {
    if (state.projectHierarchy.length > 1) {
        state.projectHierarchy.pop();
        renderActiveDrilldownNode();
    } else {
        exitActiveProject();
    }
}

function updateDrilldownCrumbs() {
    const crumbsText = 'Hierarchy: top / ' + state.projectHierarchy.map(k => k.toUpperCase()).join(' / ');
    DOM.drilldownCrumbs.innerText = crumbsText;
    
    const currentViewName = state.projectHierarchy[state.projectHierarchy.length - 1];
    DOM.cellDisplayHUD.innerText = `${currentViewName.toUpperCase()}_CELL(layout)`;
}

// ==================== SKILL PROGRAMMING SIMULATORS ====================

function setupActiveSimulatorView() {
    const projKey = state.activeProject.replace('_sim', '');
    const proj = PROJECTS_DATA[state.activeProject];
    
    DOM.simCellTitle.innerText = `CELL: ${projKey.toUpperCase()}_SIMULATOR`;
    DOM.simulatorCrumbs.innerText = `Hierarchy: top / Layout Projects / ${proj.title.toUpperCase().replace(/\s+/g, '_')}`;
    DOM.cellDisplayHUD.innerText = `${projKey.toUpperCase()}_SIM(layout)`;

    // Show corresponding SVG container
    document.querySelectorAll('.sim-panel-body').forEach(b => b.classList.add('hidden'));
    
    resetActiveSimulator();
    
    if (projKey === 'router') {
        document.getElementById('sim-body-router').classList.remove('hidden');
        updateRouterHUD();
    } else if (projKey === 'atop') {
        document.getElementById('sim-body-atop').classList.remove('hidden');
        updateAtopHUD();
    } else if (projKey === 'pathbuf') {
        document.getElementById('sim-body-pathbuf').classList.remove('hidden');
        updatePathbufHUD();
    }
}

function updateRouterHUD() {
    DOM.simHudCardContent.innerHTML = `
        <table>
            <tr><td>Routing Mode:</td><td>Inside Digital Block Core</td></tr>
            <tr><td>Target Elements:</td><td>Standard cells, Pins & Pads</td></tr>
            <tr><td>Design Node:</td><td>130nm / 65nm compatible</td></tr>
            <tr><td>Routing Status:</td><td class="sim-status-passed">Ready</td></tr>
        </table>
    `;
}

function updateAtopHUD() {
    DOM.simHudCardContent.innerHTML = `
        <table>
            <tr><td>Block Cell:</td><td>BLOCK_LEVEL_CELL</td></tr>
            <tr><td>Top Level Net:</td><td>core_output_buffer</td></tr>
            <tr><td>Analysis Method:</td><td>XOR Layout Comparison</td></tr>
            <tr><td>Top Overlaps:</td><td class="sim-status-passed">Ready to Extract</td></tr>
        </table>
    `;
}

function updatePathbufHUD() {
    const threshold = 25.0; // limit in fF
    const isBufRequired = state.pathbufCap > threshold;
    const statusText = isBufRequired ? "REQUIRED" : "NOT REQUIRED";
    const statusClass = isBufRequired ? "sim-status-failed" : "sim-status-passed";
    
    const delay = isBufRequired ? (state.pathbufCap * 0.12 + 10.5) : (state.pathbufCap * 0.48 + 8.2);
    
    DOM.simHudCardContent.innerHTML = `
        <table>
            <tr><td>Load Capacitance:</td><td>${state.pathbufCap.toFixed(1)} fF</td></tr>
            <tr><td>Capacitance Limit:</td><td>${threshold.toFixed(1)} fF</td></tr>
            <tr><td>Evaluation:</td><td class="${statusClass}">${statusText}</td></tr>
            <tr><td>Interconnect Delay:</td><td>${delay.toFixed(1)} ps</td></tr>
        </table>
    `;
}

function runActiveSimulator() {
    const projKey = state.activeProject.replace('_sim', '');
    
    if (projKey === 'router') {
        runRouterSimulation();
    } else if (projKey === 'atop') {
        runAtopSimulation();
    } else if (projKey === 'pathbuf') {
        runPathbufSimulation();
    }
}

function resetActiveSimulator() {
    const projKey = state.activeProject ? state.activeProject.replace('_sim', '') : '';
    
    DOM.simConsoleLog.innerHTML = `<div class="term-line output">> ready.</div>`;
    
    if (projKey === 'router') {
        const route1 = document.getElementById('sim-route-path-1');
        const route2 = document.getElementById('sim-route-path-2');
        route1.classList.remove('animate-wiring');
        route2.classList.remove('animate-wiring');
        route1.style.strokeDashoffset = '250';
        route1.style.strokeOpacity = '0';
        route2.style.strokeDashoffset = '250';
        route2.style.strokeOpacity = '0';
        
        document.getElementById('sim-r-via-1').style.opacity = '0';
        document.getElementById('sim-r-via-2').style.opacity = '0';
        updateRouterHUD();
    } else if (projKey === 'atop') {
        document.getElementById('sim-atop-parasitics').style.opacity = '0';
        updateAtopHUD();
    } else if (projKey === 'pathbuf') {
        document.getElementById('sim-pb-wave-in').style.opacity = '0.4';
        document.getElementById('sim-pb-wave-out').style.opacity = '0';
        updatePathbufHUD();
    }
}

// SIMULATOR RUN FUNCTIONS
function runRouterSimulation() {
    const consoleLog = DOM.simConsoleLog;
    consoleLog.innerHTML = `<div class="term-line cmd">> dbOpenCellViewByType("design_lib" "digital_core" "layout")</div>`;
    
    addLogLine(consoleLog, "INFO: SKILL Autorouter initialized inside digital core block...", "warn", 250);
    addLogLine(consoleLog, "INFO: Mapping pin terminals & standard cells...", "output", 500);
    addLogLine(consoleLog, "INFO: Routing Net 1 (AND_GATE inputs to inputs pin)...", "output", 750);
    
    // Trigger SVG animations
    setTimeout(() => {
        const route1 = document.getElementById('sim-route-path-1');
        route1.classList.add('animate-wiring');
        route1.style.strokeDashoffset = '0';
    }, 850);
    
    addLogLine(consoleLog, "INFO: Routing Net 2 (AND_GATE output to INV_GATE input)...", "output", 1200);
    
    setTimeout(() => {
        const route2 = document.getElementById('sim-route-path-2');
        route2.classList.add('animate-wiring');
        route2.style.strokeDashoffset = '0';
    }, 1300);
    
    addLogLine(consoleLog, "INFO: Standard cells routing segments created in Metal 1 (horizontal) and Metal 2 (vertical).", "output", 1600);
    
    setTimeout(() => {
        document.getElementById('sim-r-via-1').style.opacity = '1';
        document.getElementById('sim-r-via-2').style.opacity = '1';
    }, 1800);
    
    addLogLine(consoleLog, "INFO: Wiring complete. Checking DRC guidelines inside digital block...", "warn", 2100);
    
    setTimeout(() => {
        addLogLine(consoleLog, "DRC CHECK: 0 violations found. CLEAN.", "output", 200);
        addLogLine(consoleLog, "LVS CHECK: Netlist matches Layout. CLEAN.", "output", 400);
        addLogLine(consoleLog, "CELL DATABASE SAVED successfully.", "output", 600);
        
        DOM.simHudCardContent.innerHTML = `
            <table>
                <tr><td>Routing Mode:</td><td>Inside Digital Block Core</td></tr>
                <tr><td>Nets Routed:</td><td>2 Nets (Standard Cells)</td></tr>
                <tr><td>DRC Violations:</td><td>0 (Clean)</td></tr>
                <tr><td>LVS Status:</td><td class="sim-status-passed">Clean / Matched</td></tr>
            </table>
        `;
    }, 2500);
}

function runAtopSimulation() {
    const consoleLog = DOM.simConsoleLog;
    consoleLog.innerHTML = `<div class="term-line cmd">> load("atop_parasitics_analyzer.il")</div>`;
    
    addLogLine(consoleLog, "INFO: Extracting block-level cell layers...", "output", 300);
    addLogLine(consoleLog, "INFO: Performing Boolean XOR between top level layout and block cell...", "warn", 600);
    
    setTimeout(() => {
        document.getElementById('sim-atop-parasitics').style.opacity = '1';
    }, 1000);
    
    addLogLine(consoleLog, "INFO: Extracted Top-Level Metal 2 routing overlaps directly above Block Metal 1.", "output", 1200);
    addLogLine(consoleLog, "INFO: Extracted coupling capacitance Cc = 28.5 fF.", "output", 1600);
    addLogLine(consoleLog, "INFO: Extracted block routing parasitics: Rp = 0.85 Ohm, Cp = 120.0 fF.", "output", 2000);
    addLogLine(consoleLog, "INFO: Total accumulated cell parasitics: R = 0.85 Ohm, C = 148.5 fF.", "warn", 2400);
    addLogLine(consoleLog, "INFO: Netlist update: layout block parasitics successfully matched.", "output", 2850);
    
    setTimeout(() => {
        DOM.simHudCardContent.innerHTML = `
            <table>
                <tr><td>Block Cell:</td><td>BLOCK_LEVEL_CELL</td></tr>
                <tr><td>Coupling Cap (Cc):</td><td>28.5 fF (Extracted)</td></tr>
                <tr><td>Total Parasitics:</td><td>R=0.85 Ohm, C=148.5 fF</td></tr>
                <tr><td>Extraction Status:</td><td class="sim-status-passed">Complete (XOR Clean)</td></tr>
            </table>
        `;
    }, 2850);
}

function runPathbufSimulation() {
    const consoleLog = DOM.simConsoleLog;
    consoleLog.innerHTML = `<div class="term-line cmd">> load("pathbuffer_analyzer.il")</div>`;
    
    addLogLine(consoleLog, "INFO: Starting delay and slew rate scan along buffer signal path...", "warn", 300);
    addLogLine(consoleLog, "INFO: Sensed capacitance loads on driver pins...", "output", 650);
    
    setTimeout(() => {
        document.getElementById('sim-pb-wave-in').style.opacity = '1';
        document.getElementById('sim-pb-wave-out').style.opacity = '1';
    }, 900);
    
    const threshold = 25.0;
    const isBufRequired = state.pathbufCap > threshold;
    const delay = isBufRequired ? (state.pathbufCap * 0.12 + 10.5) : (state.pathbufCap * 0.48 + 8.2);
    
    addLogLine(consoleLog, `INFO: Sensed load capacitance Cload = ${state.pathbufCap.toFixed(1)} fF (Threshold limit = 25.0 fF).`, "output", 1200);
    
    if (isBufRequired) {
        addLogLine(consoleLog, "WARNING: Load capacitance exceeds threshold limit. Buffer delay skew detected.", "error", 1600);
        addLogLine(consoleLog, "RECOMMENDATION: Path buffer cell insertion is REQUIRED.", "error", 2000);
        addLogLine(consoleLog, `INFO: Optimized delay calculated: tPD = ${delay.toFixed(1)} ps (Buffered).`, "output", 2400);
    } else {
        addLogLine(consoleLog, "INFO: Load capacitance is within margins. Signal rises cleanly.", "output", 1600);
        addLogLine(consoleLog, "RECOMMENDATION: Path buffer insertion NOT REQUIRED.", "output", 2000);
        addLogLine(consoleLog, `INFO: Interconnect delay: tPD = ${delay.toFixed(1)} ps.`, "output", 2400);
    }
    
    addLogLine(consoleLog, "INFO: Path delay verification sweep complete.", "warn", 2800);
    
    setTimeout(() => {
        updatePathbufHUD();
    }, 2800);
}

// ==================== INTERACTIVE ELECTRICAL SUB-CELLS ====================

function setupElectricalHierarchyHandlers() {
    document.querySelectorAll('.sub-block-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            const sub = item.getAttribute('data-elec-sub');
            
            document.querySelectorAll('.sub-block-item').forEach(t => t.style.borderColor = 'var(--border-color)');
            item.style.borderColor = 'var(--text-accent)';
            
            let alertMsg = "";
            if (sub === 'stm32') {
                alertMsg = "STM32 Master Node details:\n- Microcontroller: STM32F103 (ARM Cortex-M3)\n- Role: Polls ADC sensor pins at high frequencies, runs priority scheduling, and formats payload bytes for CAN frame transmission.\n- Verification: Real-time execution validated via oscilloscopes and Logic Analyzers.";
            } else if (sub === 'rpi4') {
                alertMsg = "Raspberry Pi Coprocessor details:\n- System: Raspberry Pi 4 Model B (4GB RAM)\n- Role: Operates as diagnostic logger. Buffers incoming CAN messages, renders real-time dials on web panels, and streams data remotely over Wi-Fi.\n- OS: Custom Linux Kernel.";
            } else if (sub === 'can') {
                alertMsg = "CAN Transceiver Node details:\n- Controller: MCP2515 (SPI to CAN Standalone Controller)\n- Transceiver: TJA1040 (High-speed CAN Physical Layer)\n- Role: Translates logical CAN signals from MCP2515 to physical differential bus voltages. Built with bus termination switches (120 Ohm) and ESD clamp lines.";
            }
            alert(alertMsg);
        });
    });
}

// Start app
window.addEventListener('DOMContentLoaded', initApp);
