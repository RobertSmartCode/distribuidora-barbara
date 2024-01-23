export const ErrorMessage = ({ messages, errors }: { messages?: string[]; errors?: { [key: string]: string } }) => (
  <div style={{ color: 'red', fontSize: '14px', margin: '10px', textAlign: 'justify', width: '75%', marginLeft: 'auto', marginRight: 'auto' }}>
    {messages && messages.map((message, index) => (
      <p key={index} style={{ margin: '10px', width: '100%' }}>{message}</p>
    ))}
    {errors && Object.entries(errors).map(([key, error]) => (
      <p key={key} style={{ margin: '10px', width: '100%' }}>{error}</p>
    ))}
  </div>
);
