class Chunk {
    OnDrawGizmosSelected() {
        if (MarchManager.Instance.gizmosEnabled) {
            Gizmos.color = Color.red;
            Gizmos.DrawWireCube(center(), new Vector3(ChunkManager.Instance.Size - 1, ChunkManager.Instance.Size - 1, ChunkManager.Instance.Size - 1));
            Gizmos.color = Color.blue;

            for (var i = 0; i < marcher.chips.Length; i++) {
                if (marcher.chips[i].type == 4) // || marcher.chips[i].type == Chips.Grey
                {
                    Gizmos.color = Color.black;
                    Gizmos.DrawCube(marcher.PosToWorld(marcher.IndexToPos(i)), Vector3.one);
                }
            }
        }
    }

    Awake() {
    }

    Start() {
    }

    Init(_position) {
        console.log("Chunk Init");
        position = _position;
        marcher.Init(true);
    }

    Init(data) {
        position = new Vector3Int(data.position[0], data.position[1], data.position[2]);
        marcher.chips = data.chips;
        marcher.size = data.size;
        marcher.Init(false);
    }

    Chipnit = () => marcher = ChunkManager.Instance.Chipnit(position);


    center = () => transform.position + new Vector3((ChunkManager.Instance.Size - 1) * (ChunkManager.Instance.Size - 1) * (ChunkManager.Instance.Size - 1));

    Markup() {
        //ChunkManager.Instance.Markup(position);
        //return;
        chipsBuffer = new ComputeBuffer(marcher.chips.Length, sizeof());

        var mChips = [marcher.chips.Length];
        for (var i = 0; i < marcher.chips.Length; i++) mChips[i] = marcher.chips[i].iso << 24 | marcher.chips[i].type << 16 | marcher.chips[i].data;
        chipsBuffer.SetData(mChips);
        MarkupShader.SetBuffer(MarkupKernel, "chips", chipsBuffer);

        MarkupShader.SetInt("size", ChunkManager.Instance.Size);
        MarkupShader.SetInt("chipsLength", marcher.chips.Length);

        MarkupShader.Dispatch(MarkupKernel, ChunkManager.Instance.Size, ChunkManager.Instance.Size, ChunkManager.Instance.Size);

        chipsBuffer.GetData(mChips);
        chipsBuffer.Dispose();

        for (var i = 0; i < mChips.Length; i++) {
            marcher.chips[i].iso = (byte)((mChips[i] >> 24) & 0xff);
            //marcher.chips[i].type = (byte)((mChips[i] >> 16) & 0xff);
            marcher.chips[i].data = (ushort)(mChips[i] & 0xffff);
        }
    }

    MeshUpdate() { }
}