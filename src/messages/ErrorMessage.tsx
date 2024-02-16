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


export const ErrorMessageCustomizable = ({ messages, errors, containerStyle, textStyle }: { messages?: string[]; errors?: { [key: string]: string }; containerStyle?: React.CSSProperties; textStyle?: React.CSSProperties }) => (
  <div style={{ ...containerStyle, color: 'red', fontSize: '14px', textAlign: 'justify', width: '100%' }}>
    {messages && messages.map((message, index) => (
      <p key={index} style={{ ...textStyle, margin: '10px', width: '90%' }}>{message}</p>
    ))}
    {errors && Object.entries(errors).map(([key, error]) => (
      <p key={key} style={{ ...textStyle, margin: '10px', width: '90%' }}>{error}</p>
    ))}
  </div>
);
