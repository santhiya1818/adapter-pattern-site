export interface SectionItem {
  id: string;
  number: string;
  title: string;
  shortDesc: string;
}

export const FLOW_SECTIONS: SectionItem[] = [
  { id: 'intent', number: '01', title: 'Intent', shortDesc: 'The core purpose and architectural contract' },
  { id: 'also-known-as', number: '02', title: 'Also Known As', shortDesc: 'Historical naming and the Wrapper moniker' },
  { id: 'motivation', number: '03', title: 'Motivation', shortDesc: 'Physical socket metaphor and real-world legacy code' },
  { id: 'applicability', number: '04', title: 'Applicability', shortDesc: 'When to adopt, when to avoid, and decision criteria' },
  { id: 'structure', number: '05', title: 'Structure', shortDesc: 'Object Adapter vs Class Adapter UML models' },
  { id: 'participants', number: '06', title: 'Participants', shortDesc: 'Target, Client, Adaptee, and Adapter contracts' },
  { id: 'collaborations', number: '07', title: 'Collaborations', shortDesc: 'Runtime message sequence and translation pipeline' },
  { id: 'implementation', number: '08', title: 'Implementation', shortDesc: 'Two-way, pluggable, and granularity challenges' },
  { id: 'sample-code', number: '09', title: 'Sample Code', shortDesc: 'Executable multi-language implementations' },
  { id: 'known-uses', number: '10', title: 'Known Uses', shortDesc: 'Battle-tested usage in JDK, Python, Spring, and Cloud SDKs' },
  { id: 'related-patterns', number: '11', title: 'Related Patterns', shortDesc: 'Deep-dive on Command Pattern, Bridge, Facade, Decorator, and Proxy' },
];

export interface CodeLanguage {
  name: string;
  lang: string;
  extension: string;
  code: string;
}

export const CODE_SAMPLES: Record<string, CodeLanguage> = {
  typescript: {
    name: 'TypeScript',
    lang: 'typescript',
    extension: '.ts',
    code: `/**
 * Target Interface
 * Defines the domain-specific interface that client code consumes.
 */
interface ModernPaymentProcessor {
  processPayment(amountInDollars: number, currency: string, customerEmail: string): PaymentResult;
}

interface PaymentResult {
  transactionId: string;
  success: boolean;
  settledAmount: string;
  provider: string;
  timestamp: string;
}

/**
 * Adaptee (Incompatible Legacy Third-Party Service)
 * Works in integer cents, requires separate auth keys, and uses different method names.
 */
class LegacyStripeGateway {
  public executeCharge(cents: number, curr: string, authSecret: string, userToken: string): { charge_id: string; status: string; net_cents: number } {
    console.log(\`[LegacyStripeGateway] Charging \${cents} \${curr} using authSecret key...\`);
    return {
      charge_id: 'ch_' + Math.random().toString(36).substring(2, 9),
      status: 'succeeded',
      net_cents: cents
    };
  }
}

/**
 * Adapter (Object Adapter via Composition)
 * Bridges ModernPaymentProcessor calls to LegacyStripeGateway.
 */
class StripePaymentAdapter implements ModernPaymentProcessor {
  private legacyGateway: LegacyStripeGateway;
  private apiKey: string;

  constructor(legacyGateway: LegacyStripeGateway, apiKey: string) {
    this.legacyGateway = legacyGateway;
    this.apiKey = apiKey;
  }

  public processPayment(amountInDollars: number, currency: string, customerEmail: string): PaymentResult {
    // 1. Data transformation: Dollars -> Cents
    const cents = Math.round(amountInDollars * 100);
    // 2. Synthesize user token from domain customer email
    const userToken = 'tok_' + btoa(customerEmail).substring(0, 8);

    // 3. Delegate to Adaptee's incompatible method
    const rawResponse = this.legacyGateway.executeCharge(cents, currency, this.apiKey, userToken);

    // 4. Transform raw vendor response to standard domain format
    return {
      transactionId: rawResponse.charge_id,
      success: rawResponse.status === 'succeeded',
      settledAmount: \`$\${(rawResponse.net_cents / 100).toFixed(2)} \${currency}\`,
      provider: 'Stripe v2 (Adapted)',
      timestamp: new Date().toISOString()
    };
  }
}

// --- Client Code ---
function runCheckout(processor: ModernPaymentProcessor) {
  const result = processor.processPayment(49.99, 'USD', 'alex@example.com');
  console.log('Checkout completed:', result);
}

const legacyService = new LegacyStripeGateway();
const adapter = new StripePaymentAdapter(legacyService, 'sk_live_9481723');
runCheckout(adapter);`
  },
  python: {
    name: 'Python',
    lang: 'python',
    extension: '.py',
    code: `from abc import ABC, abstractmethod
import time
import uuid

# Target Interface
class PaymentProcessor(ABC):
    @abstractmethod
    def process_payment(self, amount_dollars: float, currency: str, email: str) -> dict:
        pass

# Adaptee: Incompatible 3rd-party legacy service
class LegacyPayPalService:
    def send_payment(self, cents: int, iso_curr: str, receiver_account_id: str) -> dict:
        print(f"[PayPalLegacy] Transferring {cents} cents ({iso_curr}) to {receiver_account_id}")
        return {
            "PAYMENTINFO_0_TRANSACTIONID": f"PP-{uuid.uuid4().hex[:8].upper()}",
            "ACK": "Success",
            "AMT": str(cents / 100)
        }

# Adapter: Object Adapter using composition
class PayPalAdapter(PaymentProcessor):
    def __init__(self, paypal_service: LegacyPayPalService, merchant_account: str):
        self._service = paypal_service
        self._merchant = merchant_account

    def process_payment(self, amount_dollars: float, currency: str, email: str) -> dict:
        # Convert domain representation to vendor-specific parameters
        cents = int(round(amount_dollars * 100))
        # Delegate to legacy adaptee
        resp = self._service.send_payment(cents, currency.upper(), self._merchant)
        # Adapt vendor result back to uniform interface
        return {
            "transaction_id": resp["PAYMENTINFO_0_TRANSACTIONID"],
            "success": resp["ACK"] == "Success",
            "amount": f"\${float(resp['AMT']):.2f}",
            "provider": "PayPal Legacy API (Adapted)"
        }

# Client consumer
def checkout_order(processor: PaymentProcessor):
    res = processor.process_payment(129.50, "USD", "user@domain.com")
    print("Order settled:", res)

legacy_api = LegacyPayPalService()
adapter = PayPalAdapter(legacy_api, merchant_account="merchant_corp_88")
checkout_order(adapter)`
  },
  java: {
    name: 'Java',
    lang: 'java',
    extension: '.java',
    code: `// 1. Target Interface
public interface ModernPaymentGateway {
    PaymentResponse charge(double amountInDollars, String currencyCode);
}

// 2. Adaptee (Third-Party Legacy Jar)
class OldBankApi {
    public BankReceipt dispatchDebitWire(long cents, int currencyIsoNumeric) {
        System.out.println("Processing SWIFT wire for cents: " + cents);
        return new BankReceipt("SWIFT-994821", true);
    }
}

class BankReceipt {
    public String referenceNumber;
    public boolean isApproved;
    public BankReceipt(String ref, boolean ok) {
        this.referenceNumber = ref;
        this.isApproved = ok;
    }
}

// 3. Adapter (Implements Target, encapsulates Adaptee)
public class BankApiAdapter implements ModernPaymentGateway {
    private final OldBankApi legacyBank;

    public BankApiAdapter(OldBankApi legacyBank) {
        this.legacyBank = legacyBank;
    }

    @Override
    public PaymentResponse charge(double amountInDollars, String currencyCode) {
        long cents = Math.round(amountInDollars * 100.0);
        int numericIso = currencyCode.equalsIgnoreCase("USD") ? 840 : 978;

        // Bridge to Adaptee
        BankReceipt receipt = legacyBank.dispatchDebitWire(cents, numericIso);

        // Normalize output
        return new PaymentResponse(
            receipt.referenceNumber,
            receipt.isApproved,
            "$" + String.format("%.2f", amountInDollars)
        );
    }
}

// 4. Target Return Type
class PaymentResponse {
    public final String confirmationId;
    public final boolean successful;
    public final String formattedTotal;

    public PaymentResponse(String id, boolean ok, String total) {
        this.confirmationId = id;
        this.successful = ok;
        this.formattedTotal = total;
    }
}`
  },
  csharp: {
    name: 'C#',
    lang: 'csharp',
    extension: '.cs',
    code: `using System;

// Target Interface
public interface ICloudStorage
{
    void UploadFile(string bucketName, string remotePath, byte[] payload);
    byte[] DownloadFile(string bucketName, string remotePath);
}

// Adaptee: Legacy FTP or proprietary on-premise SAN
public class LegacyFtpServer
{
    public bool Connect(string host, int port) => true;
    public int StoreBinaryBlock(string fullUri, byte[] bytes)
    {
        Console.WriteLine($"FTP STOR {fullUri} ({bytes.Length} bytes)");
        return 226; // 226 Transfer complete
    }
}

// Adapter
public class FtpToCloudStorageAdapter : ICloudStorage
{
    private readonly LegacyFtpServer _ftp;
    private readonly string _ftpHost;

    public FtpToCloudStorageAdapter(LegacyFtpServer ftp, string host = "ftp.corp.local")
    {
        _ftp = ftp;
        _ftpHost = host;
    }

    public void UploadFile(string bucketName, string remotePath, byte[] payload)
    {
        _ftp.Connect(_ftpHost, 21);
        string normalizedFtpUri = $"ftp://{_ftpHost}/{bucketName}/{remotePath}";
        int code = _ftp.StoreBinaryBlock(normalizedFtpUri, payload);
        if (code != 226) throw new InvalidOperationException("FTP upload failed");
    }

    public byte[] DownloadFile(string bucketName, string remotePath)
    {
        // Translation logic...
        return Array.Empty<byte>();
    }
}`
  },
  go: {
    name: 'Go',
    lang: 'go',
    extension: '.go',
    code: `package main

import (
	"fmt"
	"math"
)

// Target Interface in Go (Implicit Interface idiom)
type TemperatureSensor interface {
	GetCelsius() float64
}

// Adaptee (Legacy Fahrenheit hardware sensor)
type LegacyFahrenheitSensor struct{}

func (s *LegacyFahrenheitSensor) ReadDegreesFahrenheit() float64 {
	return 98.6 // Body temperature in Fahrenheit
}

// Adapter struct embedding or holding reference
type SensorAdapter struct {
	fahrenheitSensor *LegacyFahrenheitSensor
}

func NewSensorAdapter(fs *LegacyFahrenheitSensor) TemperatureSensor {
	return &SensorAdapter{fahrenheitSensor: fs}
}

func (a *SensorAdapter) GetCelsius() float64 {
	f := a.fahrenheitSensor.ReadDegreesFahrenheit()
	// Formula: (F - 32) * 5/9
	c := (f - 32.0) * 5.0 / 9.0
	return math.Round(c*100) / 100
}

func main() {
	legacy := &LegacyFahrenheitSensor{}
	var sensor TemperatureSensor = NewSensorAdapter(legacy)
	fmt.Printf("Normalized Metric Reading: %.2f °C\\n", sensor.GetCelsius())
}`
  }
};

export interface RelatedPatternComparison {
  name: string;
  category: string;
  intentSummary: string;
  keyDifferenceFromAdapter: string;
  synergyWithAdapter: string;
}

export const RELATED_PATTERNS: RelatedPatternComparison[] = [
  {
    name: 'Command Pattern',
    category: 'Behavioral',
    intentSummary: 'Encapsulates a request as an object, thereby letting you parameterize clients with different requests, queue or log requests, and support undoable operations.',
    keyDifferenceFromAdapter: 'Adapter converts an interface so two incompatible classes can communicate. Command turns an action into a first-class object with execute() / undo() methods regardless of interface.',
    synergyWithAdapter: 'High Synergy! An Adapter is frequently used as a Command: when an existing legacy class has a method you want to enqueue, you wrap the legacy class inside a Command adapter so it conforms to the uniform Command interface.'
  },
  {
    name: 'Bridge Pattern',
    category: 'Structural',
    intentSummary: 'Decouples an abstraction from its implementation so that the two can vary independently.',
    keyDifferenceFromAdapter: 'Bridge is designed up-front before components exist to allow abstractions and implementations to evolve separately. Adapter is retrofitted after the fact to make unrelated classes work together.',
    synergyWithAdapter: 'Adapter makes things work after they are designed; Bridge makes them work before they are.'
  },
  {
    name: 'Decorator Pattern',
    category: 'Structural',
    intentSummary: 'Attaches additional responsibilities to an object dynamically. Decorators provide a flexible alternative to subclassing.',
    keyDifferenceFromAdapter: 'Decorator enhances another object without changing its interface (same interface). Adapter changes the interface to make it compatible with a client.',
    synergyWithAdapter: 'A Decorator can be viewed as an adapter where the interface does not change, only the behavior is augmented.'
  },
  {
    name: 'Facade Pattern',
    category: 'Structural',
    intentSummary: 'Provides a unified interface to a set of interfaces in a subsystem. Facade defines a higher-level interface that makes the subsystem easier to use.',
    keyDifferenceFromAdapter: 'Facade defines a new, simplified interface for an entire subsystem of multiple classes. Adapter reuses an existing Target interface and usually wraps a single Adaptee object.',
    synergyWithAdapter: 'You can use a Facade when you want an easier entry point; you use an Adapter when you must conform to an existing client-expected contract.'
  },
  {
    name: 'Proxy Pattern',
    category: 'Structural',
    intentSummary: 'Provides a surrogate or placeholder for another object to control access, perform lazy evaluation, or handle remote communication.',
    keyDifferenceFromAdapter: 'Proxy provides the exact same interface as its subject to control or guard access. Adapter provides a different interface tailored to the client.',
    synergyWithAdapter: 'Both wrap an underlying object, but Proxy preserves interface identity while Adapter intentionally alters interface signature.'
  }
];

export interface QuizScenario {
  id: number;
  question: string;
  context: string;
  options: { label: string; pattern: string; isCorrect: boolean; explanation: string }[];
}

export const PATTERN_QUIZ_SCENARIOS: QuizScenario[] = [
  {
    id: 1,
    question: 'Enqueuing Legacy Hardware Operations in an Undo/Redo System',
    context: 'You are building a CNC router machine controller. You have an existing legacy robotic arm driver that exposes moveMotor(axis, microsteps). Your system requires all user actions to be queueable, recordable in a history stack, and reversible via undo().',
    options: [
      {
        label: 'Adapter alone',
        pattern: 'Adapter',
        isCorrect: false,
        explanation: 'Adapter can translate the coordinates, but it does not encapsulate the operation lifecycle, undo history, or execution queue.'
      },
      {
        label: 'Command combined with an Adapter',
        pattern: 'Command + Adapter',
        isCorrect: true,
        explanation: 'Perfect! The Command pattern encapsulates the action (execute/undo history), while an Adapter wraps the legacy moveMotor() call to fit the Command’s execute() contract.'
      },
      {
        label: 'Decorator pattern',
        pattern: 'Decorator',
        isCorrect: false,
        explanation: 'Decorator adds responsibilities to an existing interface without changing it; it does not solve action queuing or command parameterization.'
      }
    ]
  },
  {
    id: 2,
    question: 'Switching Payment Providers Without Rewriting Business Logic',
    context: 'Your e-commerce application relies on an internal IPaymentService with charge(dollars, card). You need to add support for a new Japanese credit network whose SDK only provides authorizeYen(yen, cardToken).',
    options: [
      {
        label: 'Adapter Pattern',
        pattern: 'Adapter',
        isCorrect: true,
        explanation: 'Exact textbook use case! Create an Adapter that implements IPaymentService and translates dollars to yen and card details to cardToken.'
      },
      {
        label: 'Facade Pattern',
        pattern: 'Facade',
        isCorrect: false,
        explanation: 'Facade creates a new higher-level interface. Here you already have a defined IPaymentService that client code expects.'
      },
      {
        label: 'Proxy Pattern',
        pattern: 'Proxy',
        isCorrect: false,
        explanation: 'Proxy would keep the exact same interface without translating methods or currency units.'
      }
    ]
  },
  {
    id: 3,
    question: 'Simplifying a Complex 14-Class Video Encoding Subsystem',
    context: 'You have a multimedia pipeline with AudioDemuxer, VideoCodecResolver, BitrateSampler, FramePacer, and MpegHeaderBuilder. Most client callers just want a single convert(file, format) entry point.',
    options: [
      {
        label: 'Adapter Pattern',
        pattern: 'Adapter',
        isCorrect: false,
        explanation: 'Adapter wraps an existing class to match an existing target interface; it is not meant to simplify an entire multi-class subsystem.'
      },
      {
        label: 'Facade Pattern',
        pattern: 'Facade',
        isCorrect: true,
        explanation: 'Facade defines a new, simple, high-level interface over a complex collection of subsystem classes.'
      },
      {
        label: 'Command Pattern',
        pattern: 'Command',
        isCorrect: false,
        explanation: 'Command converts requests to objects for queues and undo, rather than simplifying complex subsystems.'
      }
    ]
  }
];
