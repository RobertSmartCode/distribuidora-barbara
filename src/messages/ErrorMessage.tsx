export const ErrorMessage = ({ messages, errors }: { messages?: string[]; errors?: { [key: string]: string } }) => (
    <div style={{ color: 'red', fontSize: '14px', margin: '10px 10px', textAlign: 'justify', marginLeft: '0px', }}>
      {messages && messages.map((message, index) => (
        <p key={index} style={{ margin: '10px 10px', marginLeft: '0px', width: '75%' }}>{message}</p>
      ))}
      {errors && Object.keys(errors).map((errorKey) => (
        <p key={errorKey} style={{  margin: '10px 10px', marginLeft: '0px', width: '75%' }}>{errors[errorKey]}</p>
      ))}
    </div>
    
    );