import React, {useEffect, useState, useCallback} from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';

import Header from './Header';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import {setAccessToken} from './accessToken';
import { useUploadRouteMutation } from './generated/graphql';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [uploadRoute] = useUploadRouteMutation();
	const onDrop = useCallback(
		async ([route]) => {
			await uploadRoute({ variables: { route } });
		},
		[uploadRoute]
	);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  useEffect(() => {
    fetch(
      'http://localhost:4000/refresh_token',
      {
        method: 'POST',
        credentials: 'include',
      }
    ).then(
      async (response) => {
        const { accessToken } = await response.json();
        setAccessToken(accessToken);
        setLoading(false);
      }
    );
  }, []);

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <Header />
      <div
        {...getRootProps()}
        style={{
          width: 400,
          border: '1px solid #000',
          padding: '1em',
          margin: '1em'
        }}
      >
        <input {...getInputProps()}/>
        {isDragActive ? (
          <p>Drop the files here</p>
        ) : (
          <p>Drag 'n' drop the files here, or click to select files</p>
        )}
      </div>
      <BrowserRouter>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/register' component={Register} />
          <Route exact path='/login' component={Login} />
        </Switch>
      </BrowserRouter>
    </div>
  );
};

export default App;
