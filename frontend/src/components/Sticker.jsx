function Sticker({ nome, tamanho = 48 }) {
  const desenhos = {
    projeto: (
      <>
        <circle cx="32" cy="26" r="17" fill="#ffd84d" stroke="#14213d" strokeWidth="3" />
        <path d="M26 25 q6 -7 12 0" fill="none" stroke="#14213d" strokeWidth="3" strokeLinecap="round" />
        <rect x="24" y="42" width="16" height="11" rx="3" fill="#ffffff" stroke="#14213d" strokeWidth="3" />
        <line x1="27" y1="58" x2="37" y2="58" stroke="#14213d" strokeWidth="3" strokeLinecap="round" />
      </>
    ),
    evento: (
      <>
        <circle cx="14" cy="14" r="7" fill="#14213d" />
        <circle cx="50" cy="14" r="7" fill="#14213d" />
        <circle cx="32" cy="36" r="22" fill="#ffffff" stroke="#14213d" strokeWidth="3" />
        <path d="M32 22 V36 L42 42" fill="none" stroke="#14213d" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
    anuncio: (
      <>
        <path d="M8 26 H22 L46 12 V52 L22 38 H8 Z" fill="#ff5d8f" stroke="#14213d" strokeWidth="3" strokeLinejoin="round" />
        <path d="M53 24 q6 8 0 16" fill="none" stroke="#ffc933" strokeWidth="4" strokeLinecap="round" />
      </>
    ),
    comentario: (
      <>
        <path d="M10 12 H54 V42 H34 L22 54 V42 H10 Z" fill="#ffffff" stroke="#14213d" strokeWidth="3" strokeLinejoin="round" />
        <circle cx="24" cy="27" r="3" fill="#14213d" />
        <circle cx="32" cy="27" r="3" fill="#14213d" />
        <circle cx="40" cy="27" r="3" fill="#14213d" />
      </>
    ),
  };

  if (!desenhos[nome]) return null;

  return (
    <svg
      className="sticker"
      width={tamanho}
      height={tamanho}
      viewBox="0 0 64 64"
      aria-hidden="true"
    >
      {desenhos[nome]}
    </svg>
  );
}

export default Sticker;