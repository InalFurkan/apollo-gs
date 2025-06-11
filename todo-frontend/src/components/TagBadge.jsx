import React from 'react';

const TagBadge = ({ tag }) => (
    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
        {tag.name}
    </span>
);

export default TagBadge;
