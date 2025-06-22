from weasyprint import HTML

def generate_pdf_from_html(html: str) -> bytes:
    styled = f"""
    <html><head>
      <style>
        @page {{ size: A4; margin: 1cm; }}
        body {{ font-family: Arial, sans-serif; line-height: 1.55; }}
        h1 {{ font-size: 32px; text-align: center; margin-bottom: 4px; }}
        p {{ margin: 6px 0; }}
        h3 {{ font-size: 18px; margin-top: 18px; }}
        ul {{ margin: 8px 0; padding-left: 20px; }}
        li {{ margin-bottom: 4px; }}
        a {{ color: #2563eb; text-decoration: none; }}
      </style>
    </head>
    <body>{html}</body></html>
    """
    return HTML(string=styled).write_pdf()
