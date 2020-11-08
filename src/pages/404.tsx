import React from 'react';
import { Result } from 'antd';
import { Link } from 'react-router-dom';

function PageNotFound() {
  return (
    <Result
      status="404"
      title="404"
      extra={
        <Link to="/" type="primary">
          홈으로
        </Link>
      }
    />
  );
}

export default PageNotFound;
