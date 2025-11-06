import React, { useMemo } from 'react';
import { Select, Tag } from 'antd';

// Example list of random colors
const colors = ['#003366', '#336699', '#004c4c', '#663399', '#993333', '#2d3436', '#4a69bd', '#27ae60'];

const options = [
  { value: 'gold' },
  { value: 'lime' },
  { value: 'green' },
  { value: 'cyan' },
  { value: 'blue' }, // Added non-color value for testing
];

// Function to get a random color
const getRandomColor = () => {
  return colors[Math.floor(Math.random() * colors.length)];
};

// The tag render function now accepts a colorMap prop
const tagRender = (props, colorMap) => {
  const { label, value, closable, onClose } = props;
  const onPreventMouseDown = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <Tag
      color={colorMap[value]} // Fixed color based on value
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
      style={{ marginInlineEnd: 4 }}
    >
      {label}
    </Tag>
  );
};

const CategoryFilter = () => {
  // Memoize the color map so that each value is assigned a fixed color
  const colorMap = useMemo(() => {
    const map = {};
    options.forEach((option) => {
      map[option.value] = getRandomColor();
    });
    return map;
  }, []);

  return (
    <Select
      mode="multiple"
      tagRender={(props) => tagRender(props, colorMap)} // Pass the colorMap to the tagRender function
      defaultValue={['gold', 'cyan']}
      style={{ width: '100%'}}
      size='large'
      options={options}
    />
  );
};

export default CategoryFilter;
