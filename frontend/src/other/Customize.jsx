// import React, { useState, useEffect } from 'react';
// import { Canvas } from '@react-three/fiber';
// import { OrbitControls, useGLTF } from '@react-three/drei';
// import { DndContext, closestCenter } from '@dnd-kit/core';
// import { SortableContext, arrayMove } from '@dnd-kit/sortable';
// import './Customize.css';

// const CakeCustomizer = () => {
//   // Cake state
//   const [cakeShape, setCakeShape] = useState('round');
//   const [cakeColor, setCakeColor] = useState('#f8c8dc');
//   const [cakeSize, setCakeSize] = useState(1);
//   const [cakeText, setCakeText] = useState('');
//   const [textColor, setTextColor] = useState('#000000');
//   const [textSize, setTextSize] = useState(16);
//   const [decorations, setDecorations] = useState([]);
//   const [activeId, setActiveId] = useState(null);
//   const [aiSuggestions, setAiSuggestions] = useState([]);
//   const [isLoadingAI, setIsLoadingAI] = useState(false);
//   const [theme, setTheme] = useState('birthday');
//   const [style, setStyle] = useState('modern');
//   const [cakeTexture, setCakeTexture] = useState(null);

//   // Available options
//   const shapes = [
//     { id: 'round', name: 'Round', icon: '○' },
//     { id: 'square', name: 'Square', icon: '□' },
//     { id: 'heart', name: 'Heart', icon: '❤' },
//     { id: 'hexagon', name: 'Hexagon', icon: '⬢' }
//   ];

//   const decorationItems = [
//     { id: 'flower', name: 'Flower', icon: '✿' },
//     { id: 'star', name: 'Star', icon: '★' },
//     { id: 'balloon', name: 'Balloon', icon: '🎈' },
//     { id: 'candle', name: 'Candle', icon: '🕯' },
//     { id: 'heart', name: 'Heart', icon: '❤' }
//   ];

//   const themes = ['birthday', 'wedding', 'anniversary', 'holiday'];
//   const styles = ['modern', 'classic', 'minimalist', 'luxury'];

//   // Add decoration
//   const handleAddDecoration = (type) => {
//     const newDecoration = {
//       id: `dec-${Date.now()}`,
//       type,
//       x: 50,
//       y: 50,
//       color: getRandomColor(),
//       size: 1
//     };
//     setDecorations([...decorations, newDecoration]);
//   };

//   // Drag and drop handlers
//   const handleDragStart = (event) => {
//     setActiveId(event.active.id);
//   };

//   const handleDragEnd = (event) => {
//     const { active, over } = event;
    
//     if (active.id !== over.id) {
//       setDecorations((items) => {
//         const oldIndex = items.findIndex((item) => item.id === active.id);
//         const newIndex = items.findIndex((item) => item.id === over.id);
//         return arrayMove(items, oldIndex, newIndex);
//       });
//     }
//     setActiveId(null);
//   };

//   // AI integration
//   const fetchAISuggestions = async () => {
//     setIsLoadingAI(true);
//     try {
//       // Simulate AI API call
//       await new Promise(resolve => setTimeout(resolve, 1500));
      
//       // Mock AI response
//       const mockSuggestions = [
//         {
//           id: 'ai-1',
//           name: 'Elegant Floral',
//           colors: ['#f8c8dc', '#ffffff'],
//           decorations: ['flower', 'flower', 'flower'],
//           texture: 'floral-pattern'
//         },
//         {
//           id: 'ai-2',
//           name: 'Modern Geometric',
//           colors: ['#2a9d8f', '#e9c46a'],
//           decorations: ['star', 'star', 'hexagon'],
//           texture: 'marble-effect'
//         }
//       ];
      
//       setAiSuggestions(mockSuggestions);
//     } catch (error) {
//       console.error('AI suggestion error:', error);
//     } finally {
//       setIsLoadingAI(false);
//     }
//   };

//   const applyAISuggestion = (suggestion) => {
//     setCakeColor(suggestion.colors[0]);
//     setTheme(suggestion.name.toLowerCase());
    
//     const newDecorations = suggestion.decorations.map((type, index) => ({
//       id: `ai-dec-${Date.now()}-${index}`,
//       type,
//       x: 20 + (index * 20),
//       y: 30 + (index * 10),
//       color: suggestion.colors[1] || getRandomColor(),
//       size: 0.8 + (index * 0.1)
//     }));
    
//     setDecorations(newDecorations);
//     setCakeTexture(suggestion.texture);
//   };

//   // Generate random color
//   const getRandomColor = () => {
//     const letters = '0123456789ABCDEF';
//     let color = '#';
//     for (let i = 0; i < 6; i++) {
//       color += letters[Math.floor(Math.random() * 16)];
//     }
//     return color;
//   };

//   // 3D Cake Component
//   const CakeModel = () => {
//     let cakeGeometry;
    
//     // Simple geometries for demonstration
//     switch(cakeShape) {
//       case 'round':
//         cakeGeometry = <sphereGeometry args={[1, 32, 32]} />;
//         break;
//       case 'square':
//         cakeGeometry = <boxGeometry args={[2, 1, 2]} />;
//         break;
//       case 'heart':
//         // Would normally use a custom GLTF model
//         cakeGeometry = <sphereGeometry args={[1, 32, 32]} />;
//         break;
//       default:
//         cakeGeometry = <cylinderGeometry args={[1, 1, 1, 6]} />;
//     }
    
//     return (
//       <group>
//         <mesh position={[0, 0, 0]}>
//           {cakeGeometry}
//           <meshStandardMaterial color={cakeColor} />
//         </mesh>
        
//         {decorations.map((dec, index) => (
//           <Decoration key={dec.id} decoration={dec} index={index} />
//         ))}
//       </group>
//     );
//   };

//   const Decoration = ({ decoration, index }) => {
//     let decorationGeometry;
    
//     switch(decoration.type) {
//       case 'flower':
//         decorationGeometry = <sphereGeometry args={[0.2, 16, 16]} />;
//         break;
//       case 'star':
//         decorationGeometry = <sphereGeometry args={[0.2, 5, 5]} />;
//         break;
//       default:
//         decorationGeometry = <sphereGeometry args={[0.15, 16, 16]} />;
//     }
    
//     const xPos = -0.8 + (index * 0.4);
//     const yPos = 0.5 + (index * 0.1);
    
//     return (
//       <mesh position={[xPos, yPos, 0.8]}>
//         {decorationGeometry}
//         <meshStandardMaterial color={decoration.color} />
//       </mesh>
//     );
//   };

//   return (
//     <div className="app-container">
//       <header className="app-header">
//         <h1>AI Cake Designer</h1>
//         <p>Create your perfect cake with AI assistance</p>
//       </header>
      
//       <div className="main-content">
//         {/* Controls Panel */}
//         <div className="controls-panel">
//           <div className="control-section">
//             <h3>Occasion</h3>
//             <div className="theme-options">
//               {themes.map((t) => (
//                 <button
//                   key={t}
//                   className={`theme-btn ${theme === t ? 'active' : ''}`}
//                   onClick={() => setTheme(t)}
//                 >
//                   {t.charAt(0).toUpperCase() + t.slice(1)}
//                 </button>
//               ))}
//             </div>
//           </div>
          
//           <div className="control-section">
//             <h3>Style</h3>
//             <div className="style-options">
//               {styles.map((s) => (
//                 <button
//                   key={s}
//                   className={`style-btn ${style === s ? 'active' : ''}`}
//                   onClick={() => setStyle(s)}
//                 >
//                   {s.charAt(0).toUpperCase() + s.slice(1)}
//                 </button>
//               ))}
//             </div>
//           </div>
          
//           <div className="control-section">
//             <h3>Cake Shape</h3>
//             <div className="shape-options">
//               {shapes.map((shape) => (
//                 <button
//                   key={shape.id}
//                   className={`shape-btn ${cakeShape === shape.id ? 'active' : ''}`}
//                   onClick={() => setCakeShape(shape.id)}
//                 >
//                   {shape.icon} {shape.name}
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div className="control-section">
//             <h3>Cake Color</h3>
//             <input 
//               type="color" 
//               value={cakeColor}
//               onChange={(e) => setCakeColor(e.target.value)}
//             />
//             <button 
//               className="random-color"
//               onClick={() => setCakeColor(getRandomColor())}
//             >
//               Random Color
//             </button>
//           </div>

//           <div className="control-section">
//             <h3>Cake Size</h3>
//             <input
//               type="range"
//               min="0.5"
//               max="2"
//               step="0.1"
//               value={cakeSize}
//               onChange={(e) => setCakeSize(parseFloat(e.target.value))}
//             />
//             <span>{cakeSize.toFixed(1)}x</span>
//           </div>

//           <div className="control-section">
//             <h3>Cake Text</h3>
//             <input
//               type="text"
//               placeholder="Happy Birthday!"
//               value={cakeText}
//               onChange={(e) => setCakeText(e.target.value)}
//             />
//             <div className="text-controls">
//               <label>Color:
//                 <input
//                   type="color"
//                   value={textColor}
//                   onChange={(e) => setTextColor(e.target.value)}
//                 />
//               </label>
//               <label>Size:
//                 <input
//                   type="range"
//                   min="10"
//                   max="36"
//                   value={textSize}
//                   onChange={(e) => setTextSize(parseInt(e.target.value))}
//                 />
//                 <span>{textSize}px</span>
//               </label>
//             </div>
//           </div>

//           <div className="control-section">
//             <h3>Decorations</h3>
//             <div className="decoration-options">
//               {decorationItems.map((item) => (
//                 <button
//                   key={item.id}
//                   className="decoration-btn"
//                   onClick={() => handleAddDecoration(item.id)}
//                 >
//                   {item.icon} {item.name}
//                 </button>
//               ))}
//             </div>
//           </div>
          
//           <div className="control-section ai-section">
//             <h3>AI Designer</h3>
//             <button 
//               className="ai-suggest-btn"
//               onClick={fetchAISuggestions}
//               disabled={isLoadingAI}
//             >
//               {isLoadingAI ? 'Generating...' : 'Get AI Suggestions'}
//             </button>
            
//             {aiSuggestions.length > 0 && (
//               <div className="ai-suggestions">
//                 <h4>AI Suggestions:</h4>
//                 <div className="suggestion-grid">
//                   {aiSuggestions.map((suggestion) => (
//                     <div 
//                       key={suggestion.id}
//                       className="suggestion-card"
//                       onClick={() => applyAISuggestion(suggestion)}
//                     >
//                       <div 
//                         className="suggestion-preview"
//                         style={{ 
//                           backgroundColor: suggestion.colors[0],
//                           borderColor: suggestion.colors[1] || '#ccc'
//                         }}
//                       >
//                         {suggestion.decorations.map((dec, i) => (
//                           <span 
//                             key={i}
//                             className="suggestion-decoration"
//                             style={{ color: suggestion.colors[1] || '#333' }}
//                           >
//                             {decorationItems.find(d => d.id === dec)?.icon}
//                           </span>
//                         ))}
//                       </div>
//                       <p>{suggestion.name}</p>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* 3D Cake Canvas */}
//         <div className="cake-canvas">
//           <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
//             <ambientLight intensity={0.5} />
//             <pointLight position={[10, 10, 10]} />
//             <CakeModel />
//             <OrbitControls enableZoom={true} />
//           </Canvas>
          
//           <DndContext 
//             collisionDetection={closestCenter}
//             onDragStart={handleDragStart}
//             onDragEnd={handleDragEnd}
//           >
//             <SortableContext items={decorations}>
//               <div className="decoration-list">
//                 <h3>Your Decorations</h3>
//                 {decorations.length === 0 ? (
//                   <p className="empty-message">Add decorations from the panel</p>
//                 ) : (
//                   <ul>
//                     {decorations.map((dec) => (
//                       <li key={dec.id} className="decoration-item">
//                         <span className="dec-icon">
//                           {decorationItems.find(d => d.id === dec.type)?.icon}
//                         </span>
//                         <span className="dec-name">
//                           {decorationItems.find(d => d.id === dec.type)?.name}
//                         </span>
//                         <button 
//                           className="remove-dec"
//                           onClick={() => setDecorations(decorations.filter(d => d.id !== dec.id))}
//                         >
//                           ×
//                         </button>
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//               </div>
//             </SortableContext>
//           </DndContext>
//         </div>
//       </div>
      
//       <footer className="app-footer">
//         <button className="save-design">Save Design</button>
//         <button className="order-now">Order Now</button>
//       </footer>
//     </div>
//   );
// };

// export default CakeCustomizer;