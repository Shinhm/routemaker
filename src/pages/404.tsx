import React from 'react';
import { Link } from 'react-router-dom';

function PageNotFound() {
  return (
    <div>
      <Link to="/" type="primary">
        홈으로
      </Link>
    </div>
  );
}

export default PageNotFound;
