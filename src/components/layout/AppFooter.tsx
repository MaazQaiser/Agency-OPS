type AppFooterProps = {
  text: string;
};

export function AppFooter({ text }: AppFooterProps) {
  return <footer className="app-footer">{text}</footer>;
}
