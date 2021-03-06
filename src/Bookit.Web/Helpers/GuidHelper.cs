using System;

namespace Bookit.Web.Helpers;

public class GuidHelper
{
	public static string Encode(Guid guid)
	{
		string enc = Convert.ToBase64String(guid.ToByteArray());
		enc = enc.Replace("/", "_");
		enc = enc.Replace("+", "-");
		return enc.Substring(0, 22);
	}

	public static Guid Decode(string encoded)
	{
		encoded = encoded.Replace("_", "/");
		encoded = encoded.Replace("-", "+");
		byte[] buffer = Convert.FromBase64String(encoded + "==");
		return new Guid(buffer);
	}
}
