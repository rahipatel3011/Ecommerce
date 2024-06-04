

export const currencyFormat = (amount)=>{
    return amount.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
      });
}



export const dateFormat = (date)=>{
  const dateTime = new Date(date);
  return dateTime.toLocaleString("en-us",{
    day: '2-digit', month: 'short', year: 'numeric'
  });
}

export const titleCase = (text) => {
  return text.toLowerCase().replace(/\b\w/g, function(char) {
      return char.toUpperCase();
  });
}