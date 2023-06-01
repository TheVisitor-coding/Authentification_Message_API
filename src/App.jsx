import { ClerkProvider, RedirectToSignIn, SignedIn, SignedOut, useAuth, useClerk } from '@clerk/clerk-react'
import { Box, Button, Container, FormControl, Paper, TextField } from '@material-ui/core';
import { useEffect, useState } from 'react';


function App() {

const clerkPubKey = import.meta.env.VITE_CLERK_FRONTEND_API_KEY;
const { isSignedIn, getToken } = useAuth();
const { signOut } = useClerk();

  async function SendMessage() {
    
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [to, setTo] = useState('');
    const [message, setMessage] = useState('');
    const [token, setToken] = useState(null); // État pour stocker le token


const send = async (e) => {};
    e.preventDefault();

  useEffect(() => {
    const fetchToken = async () => {
      const fetchedToken = await getToken();
      setToken(fetchedToken);
    };

    if (isSignedIn) {
      fetchToken();
    }
  }, [isSignedIn, getToken]);
    try {
        const res = await fetch('https://proxy.api.permit.io/proxy/52f97ff8bd8147b790674231100ed265?url=api.nexmo.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                from: '14157386102',
                to,
                text: message,
                channel: 'sms',
                message_type: 'text',
            }),
        });
        if (res.status !== 202) {
            const body = await res.json();
            setError(body?.detail || 'Error sending message');
            return;
        }
        setSuccess('Message sent');
    } catch (error) {
        setError(error.message);
        return;
    }
    

    return (
      <>
      <Container maxWidth="sm">
          <Paper component={'form'} sx={{ p: 1 }} onSubmit={send}>
              {error && <Alert severity='error' sx={{ mb: 1 }} onClose={() => (setError(''))}>{error}</Alert>}
              {success && <Alert severity='success' sx={{ mb: 1 }} onClose={() => (setSuccess(''))}>{success}</Alert>}
              <Box sx={{ display: 'flex' }}>
                  <FormControl sx={{ mb: 1, flex: 1 }}>
                      <TextField label='To' id="to" value={to} onChange={(e) => setTo(e.target.value)} />
                  </FormControl>
              </Box>
              <Box sx={{ display: 'flex' }}>
                  <FormControl sx={{ m: 0, minWidth: 200, flex: 1 }}>
                      <TextField label='message' id="message" multiline minRows={4} value={message} onChange={(e) => setMessage(e.target.value)} />
                  </FormControl>
              </Box>
              <Button variant="contained" type="submit" fullWidth sx={{ mt: 1 }}>Send</Button>
          </Paper>
          <Button variant='outlined' fullWidth sx={{ mt: 1 }} onClick={() => (signOut())}>Sign Out</Button>
      </Container>
  </>
    )
}
  return ( 
    <>
            <ClerkProvider publishableKey={clerkPubKey}>
                <SignedIn>
                    <SendMessage />
                </SignedIn>
                <SignedOut>
                    <RedirectToSignIn />
                </SignedOut>
            </ClerkProvider>
            
        </>

   );
}

export default App;