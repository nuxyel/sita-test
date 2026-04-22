interface BrandLogoProps {
  compact?: boolean;
}

const BrandLogo = ({ compact = false }: BrandLogoProps) => {
  return (
    <div className={compact ? 'brand-logo brand-logo--compact' : 'brand-logo'}>
      <div className="brand-logo__wordmark" aria-label="sidia">
        <span className="brand-logo__letter">s</span>
        <span className="brand-logo__i-stack">
          <span className="brand-logo__dot" />
          <span className="brand-logo__letter">i</span>
        </span>
        <span className="brand-logo__letter">d</span>
        <span className="brand-logo__i-stack">
          <span className="brand-logo__dot" />
          <span className="brand-logo__letter">i</span>
        </span>
        <span className="brand-logo__letter">a</span>
      </div>
    </div>
  );
};

export default BrandLogo;
