// import fs from 'node:fs/promises';
import fs from 'node:fs';
import path from 'node:path';

import Freshness, { computeUrlSafeBase64Digest } from 'freshness';

const pluginNamespace = 'imp';

export default function impPlugin({ filter } = {}) {
  const _sources = new Map();
  const _resolveDirs = new Map();
  const _freshness = new Freshness();
  return {
    name: 'imp',
    setup(build) {
      build.onStart(() => {
        _sources.clear();
        _resolveDirs.clear();
      });

      build.onResolve({ filter }, async (args) => {
        const filePath = path.relative('', path.join(args.resolveDir, args.path));
        _resolveDirs.set(filePath, args.resolveDir);
        return { path: filePath, namespace: pluginNamespace };
      });

      build.onLoad({ filter: /.*/, namespace: pluginNamespace }, async (args) => {
        const withDict = args.with || {};
        const dest = withDict.dest || '';
        // const sources = withDict.sources ? parseSourcesString(withDict.sources) : [];

        const importingDir = _resolveDirs.get(args.path);
        const primarySource = path.relative(importingDir, path.resolve('', args.path));
        const primarySources = [primarySource];

        const watchFilesSet = new Set();
        // for (const source of primarySources) {
        //   const includedFiles = new Set();

        //   const relPath = path.relative('', path.resolve(importingDir, source))

        //   foundFiles.forEach(file => {
        //     includedFiles.add(path.relative('', path.resolve(importingDir, file)));
        //   });

        //   _entryPoints.set(relPath, includedFiles);
        //   includedFiles.forEach(p => watchFilesSet.add(p));
        // }

        // const fresh = !(fs.existsSync(outFile) && await _freshness.check(watchFilesSet));
        // if (!fresh) {
        // }

        const dstdir = path.resolve('', build.initialOptions.outdir || path.dirname(build.initialOptions.outfile));
        await fs.promises.mkdir(dstdir, { recursive: true });
        const basename = path.basename(args.path);

        await fs.promises.copyFile(args.path, path.join(dstdir, basename));

        // const source = await fs.promises.readFile(args.path, 'utf8');
        // await fs.promises.writeFile(path.join(dstdir, basename), source, 'utf8');
        return {
          contents: '',
          watchFiles: [...watchFilesSet],
          loader: 'file'
        };
      });

      build.onEnd(async () => {
        // _freshness.update(new Set([..._sources.values()].flatMap(set => [...set])));
      });
    },
  };
}
