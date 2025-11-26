#!/usr/bin/env node
import * as esbuild from 'esbuild';
import { chmod, readFile, writeFile } from 'fs/promises';

async function build() {
  try {
    // Bundle the server with all dependencies
    await esbuild.build({
      entryPoints: ['src/index.ts'],
      bundle: true,
      platform: 'node',
      target: 'node18',
      format: 'esm',
      outfile: 'build/index.js',
      external: [],
      minify: false,
      sourcemap: false,
      treeShaking: true,
    });

    // Add shebang to the built file
    const content = await readFile('build/index.js', 'utf8');
    if (!content.startsWith('#!/usr/bin/env node')) {
      await writeFile('build/index.js', '#!/usr/bin/env node\n' + content);
    }

    // Make the output file executable
    await chmod('build/index.js', 0o755);

    console.log('✅ Build successful! Bundle created at build/index.js');
    console.log('📦 All dependencies bundled - ready for npx!');
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

build();
