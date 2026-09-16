const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // We look for:
      //   ngOnInit(): void {
      //     ... (any code inside ngOnInit)
      //   }
      //
      //     const user = this.authService.getCurrentUser();
      //     ...
      //     }
      
      const regex = /(ngOnInit\(\):\s*void\s*\{[\s\S]*?)(  \}\r?\n\r?\n    const user = this\.authService\.getCurrentUser\(\);[\s\S]*?\}\r?\n      \}\);\r?\n    \})/g;
      
      if (regex.test(content)) {
        console.log('Fixing: ' + fullPath);
        // We capture the inside of ngOnInit (group 1) and the outside block (group 2)
        // Group 2 starts with "  }" which closes ngOnInit.
        // We want to remove that "  }" and put it at the very end of the outside block.
        const newContent = content.replace(regex, (match, p1, p2) => {
            const strippedP2 = p2.replace(/^  \}\r?\n/, ''); // remove the closing brace of ngOnInit
            return p1 + strippedP2 + '\n  }';
        });
        fs.writeFileSync(fullPath, newContent, 'utf8');
      }
    }
  }
}

processDir('e:/Work/AccSoft/Frontend/src/app');
console.log('Done');
