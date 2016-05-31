import markdown from 'markdown';

describe('markdown', function() {

  it('test markdown', () => {
    const md_content = "Hello.\n\n* This is markdown.\n* It is fun\n* Love it or leave it."
    const html_content = markdown.markdown.toHTML( md_content );
    console.log(html_content);
  });

});
