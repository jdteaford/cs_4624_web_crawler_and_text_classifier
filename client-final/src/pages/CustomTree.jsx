import React, { useState } from 'react';
import Tree from 'react-d3-tree';

const CustomTree = ({ data }) => {
  const [hoveredNodeInfo, setHoveredNodeInfo] = useState(null);

  const handleNodeClick = (node) => {
    setHoveredNodeInfo(node);
  };

  const handleNodeHover = (nodeData) => {
    setHoveredNodeInfo(nodeData);
  };

  const handleNodeHoverOut = () => {
    setHoveredNodeInfo(null);
  };

  const renderTooltip = () => {
    if (hoveredNodeInfo) {
      const tooltipStyle = {
        position: 'fixed',
        top: '10px', // Adjust top position as needed
        left: '10px', // Adjust left position as needed
        backgroundColor: '#ffffff', // Tooltip background color
        padding: '10px', // Padding around the tooltip content
        border: '1px solid #000000', // Tooltip border
        zIndex: 9999, // Ensure tooltip is above other elements
      };

      return (
        <div style={tooltipStyle}>
          <p>Avg Score: {hoveredNodeInfo.data.Avg_score}</p>
          <p>URL: {hoveredNodeInfo.data.URL}</p>
          {/* Add other relevant data here */}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%', height: '80vh', position: 'relative' }}>
      {renderTooltip()}
      <Tree 
        data={data} 
        separation={{ siblings: 1, nonSiblings: 2 }} 
        orientation="vertical"
        nodeSize={{ x: 300, y: 100 }} // Adjust node size as needed
        onClick={handleNodeClick} // Attach click event handler
        onNodeMouseOver={handleNodeHover} 
        onNodeMouseOut={handleNodeHoverOut} // Handle hover out event
        translate={{ x: 400, y: 50 }}
        nodeSvgShape={{ shape: 'circle', shapeProps: { r: 200 } }}
        // zoomable={false}
      />
    </div>
  );
};

export default CustomTree;
