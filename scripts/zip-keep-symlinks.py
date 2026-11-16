#!/usr/bin/env python3
"""zip -y equivalent: zip a .app bundle keeping symlinks and permissions (like `ditto -c -k --keepParent`)."""
import os, stat, sys, zipfile

src, out = os.path.abspath(sys.argv[1]), os.path.abspath(sys.argv[2])
base = os.path.dirname(src)
if os.path.exists(out):
    os.remove(out)
links = files = 0
with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as z:
    def add_dir(p):
        zi = zipfile.ZipInfo(os.path.relpath(p, base) + '/')
        zi.external_attr = (stat.S_IFDIR | 0o755) << 16 | 0x10
        zi.create_system = 3
        z.writestr(zi, b'')
    add_dir(src)
    for d, dirs, fs in os.walk(src, followlinks=False):
        for name in sorted(dirs + fs):
            p = os.path.join(d, name)
            rel = os.path.relpath(p, base)
            st = os.lstat(p)
            if stat.S_ISLNK(st.st_mode):
                zi = zipfile.ZipInfo(rel)
                zi.create_system = 3
                zi.external_attr = (stat.S_IFLNK | 0o755) << 16
                z.writestr(zi, os.readlink(p), compress_type=zipfile.ZIP_STORED)
                links += 1
            elif stat.S_ISDIR(st.st_mode):
                add_dir(p)
            else:
                zi = zipfile.ZipInfo.from_file(p, rel)
                zi.create_system = 3
                zi.external_attr = (stat.S_IFREG | stat.S_IMODE(st.st_mode)) << 16
                with open(p, 'rb') as f:
                    z.writestr(zi, f.read(), compress_type=zipfile.ZIP_DEFLATED)
                files += 1
        dirs[:] = [x for x in dirs if not os.path.islink(os.path.join(d, x))]
print(f'zipped {files} files, {links} symlinks -> {out}')
