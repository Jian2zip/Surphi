if ('IntersectionObserver' in window) {
  const records = document.querySelectorAll('.record');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  records.forEach((record) => observer.observe(record));
} else {
  document.querySelectorAll('.record').forEach((record) => {
    record.classList.add('is-visible');
  });
}
