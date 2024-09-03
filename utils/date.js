export const convertInputToSave = (date) => {
    if (!date) return '';
    const pad = (num) => String(num).padStart(2, '0');
    const padMilliseconds = (num) => String(num).padStart(3, '0');
    
    const year = date.getUTCFullYear();
    const month = pad(date.getUTCMonth() + 1);
    const day = pad(date.getUTCDate());
    const hours = pad(date.getUTCHours());
    const minutes = pad(date.getUTCMinutes());
    const seconds = pad(date.getUTCSeconds());
    const milliseconds = padMilliseconds(date.getUTCMilliseconds());
    
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}+00:00`;
};

export const convertDataToOutput = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return null;
    };
  
    return date
};

export const convertDataToOutputString = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return null;
  };

  const formattedDate = date.toLocaleDateString("en-GB");

  return formattedDate;
};

