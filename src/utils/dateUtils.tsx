export const getFormattedDate = (): string => {
    const currentDate = new Date();
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    } as const;
    return currentDate.toLocaleDateString("es-ES", options);
  };
  