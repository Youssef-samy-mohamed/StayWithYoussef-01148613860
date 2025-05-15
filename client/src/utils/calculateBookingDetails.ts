const calculateBookingDetails = (
  checkInDate: string | null,
  checkOutDate: string | null,
  pricePerNight: number
) => {
  let numberOfNights = 1;
  let totalPrice = pricePerNight;
  if (checkInDate && checkOutDate) {
    const timeDiff =
      new Date(checkOutDate).getTime() - new Date(checkInDate).getTime();
    numberOfNights = Math.max(1, Math.ceil(timeDiff / (1000 * 3600 * 24)));
    totalPrice = Math.round(numberOfNights * pricePerNight * 100) / 100;
  }
  return { numberOfNights, totalPrice };
};

export default calculateBookingDetails;
